---
title: Azure DevOps for CI and CD
slug: azure-devops-for-ci-and-cd
date: 2018-11-01
draft: false
tags:
- devops
- azure
- ci
- cd
- azuredevops
- build
- release
- yaml
---
I set up CI and CD for two of my applications using [Azure DevOps](https://azure.microsoft.com/en-us/services/devops/). It was quite easy. Setting up the build pipeline is as simple as including a YAML file in your source repository. It then just comes down to knowing [how the build YAML schema works](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=vsts&tabs=schema). As far as the release (or deployment) pipeline is concerned, though, I could not find a similar method. I had to set it up through the Azure DevOps UI. I don't know if there is some information I am missing, but that would seem to somewhat go against the DevOps principle - you know - *infrastructure as code* and all.

Anyway, my personal website and blog is a straight forward Razor app based on ASP.NET Core. The build YAML was then very simple:

	pool:
	  vmImage: 'VS2017-Win2016'
	
	variables:
	  buildConfiguration: 'Release'
	
	steps:
	- script: |
	    dotnet build --configuration $(buildConfiguration)
	    dotnet publish --configuration $(buildConfiguration) --output $(Build.BinariesDirectory)/publish
	  displayName: 'Build Application'
	
	- task: ArchiveFiles@2
	  inputs:
	    rootFolderOrFile: '$(Build.BinariesDirectory)/publish' 
	    includeRootFolder: false
	    archiveType: 'zip'
	    archiveFile: '$(Build.ArtifactStagingDirectory)/$(Build.BuildId).zip' 
	    replaceExistingArchive: true 
	  displayName: 'Zip Build Output'
	
	- task: PublishBuildArtifacts@1
	displayName: 'Publish Build Artifacts' 

Things to note here - at first, it was not obvious to me that I need to actually publish the build artifacts for it to be available further down the pipeline. Once I figured that out, though, the built-in task makes this easy. I did have to zip up my folder, though. It's a good idea, anyway, as it's easier than uploading a gazillion files, but I couldn't get it to work without zipping it up. Second, even though I am running the build on a Windows machine, I could just as easily have picked a Linux box since this is .NET Core.

My release pipeline is pretty simple - there are no multiple stages, and it just comes down to one task - the [Azure App Service deploy](https://docs.microsoft.com/en-us/azure/devops/pipelines/targets/webapp?view=vsts&tabs=yaml) task.

I guess the only difference with my other application, [Listor]({{< ref "listor-showcasing-react-and-dotnet-core" >}}), is that it is a React based SPA with a .NET Core backend. So the build is a little more involved. I therefore found it easier to just write a custom PowerShell script and call that from the build YAML rather than messing around with it in YAML.

	$ErrorActionPreference = "Stop"
	Push-Location AK.Listor.WebClient
	Write-Host "Installing web client dependencies..."
	npm install
	If ($LastExitCode -Ne 0) { Throw "npm install failed." }
	Write-Host "Building web client..."
	npm run build
	If ($LastExitCode -Ne 0) { Throw "npm run build failed." }
	Pop-Location
	Write-Host "Deleting existing client files..."
	[System.IO.Directory]::GetFiles("AK.Listor\Client", "*.*") | Where-Object {
		[System.IO.Path]::GetFileName($_) -Ne ".gitignore"
	} | ForEach-Object {
		$File = [System.IO.Path]::GetFullPath($_)
		[System.IO.File]::Delete($File)
	}
	[System.IO.Directory]::GetDirectories("AK.Listor\Client") | ForEach-Object {
		$Directory = [System.IO.Path]::GetFullPath($_)
		[System.IO.Directory]::Delete($Directory, $True)
	}
	Write-Host "Copying new files..."
	[System.IO.Directory]::GetFiles("AK.Listor.WebClient\build", "*.*", "AllDirectories") | Where-Object {
		-Not ($_.EndsWith("service-worker.js"))
	} | ForEach-Object {
		$SourceFile = [System.IO.Path]::GetFullPath($_)
		$TargetFile = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine("AK.Listor\Client", $_.Substring(26)))
		Write-Host "$SourceFile --> $TargetFile"
		$TargetDirectory = [System.IO.Path]::GetDirectoryName($TargetFile)
		If (-Not [System.IO.Directory]::Exists($TargetDirectory)) {
			[System.IO.Directory]::CreateDirectory($TargetDirectory) | Out-Null
		}
		[System.IO.File]::Copy($SourceFile, $TargetFile, $True) | Out-Null
	}
	Write-Host "Building application..."
	dotnet build
	If ($LastExitCode -Ne 0) { Throw "dotnet build failed." }

The build YAML, then is simple enough:

	pool:
	  vmImage: 'VS2017-Win2016'
	
	variables:
	  buildConfiguration: 'Release'
	
	steps:
	- script: |
	    powershell -F build.ps1
	    dotnet publish --configuration $(buildConfiguration) --output $(Build.BinariesDirectory)/publish	
	  displayName: 'Run Build Script'
	
	- task: ArchiveFiles@2
	  inputs:
	    rootFolderOrFile: '$(Build.BinariesDirectory)/publish' 
	    includeRootFolder: false
	    archiveType: 'zip'
	    archiveFile: '$(Build.ArtifactStagingDirectory)/$(Build.BuildId).zip' 
	    replaceExistingArchive: true 
	  displayName: 'Zip Build Output'
	
	- task: PublishBuildArtifacts@1
	displayName: 'Publish Build Artifacts'

The release pipeline, of course, is identical since both these applications are hosted as app services on Azure. Since deploying these applications to production, I have had to make a few changes and this CI/CD pipeline has proved very helpful.