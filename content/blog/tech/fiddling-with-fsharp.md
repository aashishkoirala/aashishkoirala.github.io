---
title: Fiddling with F#
slug: fiddling-with-fsharp
date: 2016-06-05
draft: false
tags:
- fsharp
- functionalprogramming
---
I have always had a keen interest in functional programming. While I still shy away from going completely functional for full-blown applications, I try to use the tenets of functional programming as much as I can even when writing C#. This is made much easier by the fact that C# has borrowed a lot of functional programming features as it has evolved. With each new version of the language, I find my code getting more concise and more expressive mostly owing to these features. That said, if you are looking for a functional-first experience, nothing beats a functional language. I like **F#** as it belongs to the .NET ecosystem but is derived from **OCaml** which itself is quite elegant.

There is somewhat of a barrier to entry with functional programming in terms of the learning curve. Sites like [this amazing one by Scott Wlaschin](https://fsharpforfunandprofit.com/) make it much more appealing. Having said all that, since I am not quite at the point where I will build a full blown application with F# (plus I can't at my day job anyway), but I have that itch to use it that needs to be scratched, I found a good use case for it, at my day job nonetheless.

Any time I need to write a quick script that does something, I default to F# these days. A good example of this is a bunch of project file cleanup scripts I needed to write that cleaned up CSPROJ files (references, Nuget packages and what not). I keep an F# program around (not even an actual compiled program - it's a LINQPad script) that I run and add to as needed, and it works beautifully. Here are a few snippets from it that are generic enough that I can share here. Everything is in a `module ProjectCleanup`.

Some basic utility functions first:

    let getFiles sourcePath pattern = 
        Directory.GetFiles(sourcePath, pattern, SearchOption.AllDirectories)
    
    let excludeNones (xs: seq<'a option>) =
        xs
        |> Seq.filter (fun x -> match x with Some _ -> true | _ -> false)
        |> Seq.map (fun x -> match x with Some x' -> x' | _ -> failwith "Invalid")
    
    let toElements (nodes:XmlNodeList) = seq {
        for node in nodes do
            yield node :?> XmlElement
    }

    let toMatches (ms:MatchCollection) = seq {
        for m in ms do
            yield m
    }
    
    let toMany (a:seq<seq<'a>>) = seq {
        for x in a do
            for y in x do
                yield y
    }

A few helper functions to work with a bunch of files or a bunch of XML files (which CSPROJ files are).

    let processFilesXml processor (files: seq<string>) =
        files
        |> Seq.iter (fun f ->
            let d = XmlDocument()
            d.Load f
            match processor d |> Seq.exists id with
            | true -> d.Save f
            | false -> () 
        )
    
    let processFilesLines processor files =
        files
        |> Seq.iter (fun f ->
            let ls = File.ReadAllLines f
            let lcs = processor ls
            let changed = lcs |> Seq.exists (fun (c, _) -> c)
            let ls' = lcs |> Seq.map (fun (_, l) -> l) |> Seq.toArray
            match changed with true -> File.WriteAllLines(f, ls') | _ -> ()
        )

The following removes specific targets and imports that intrude into the CSPROJ when you install certain packages. They serve a purpose, but not in my case - so they have to go.
    
    let removeBadTargetsAndImports sourcePath =
        printfn "Removing bad targets and imports from %s..." sourcePath
        getFiles sourcePath "*.csproj"
        |> processFilesXml (fun d ->        
            let importElementsToRemove =
                d.GetElementsByTagName "Import"
                |> toElements
                |> Seq.map (fun e ->
                   match e.GetAttribute("Project").ToLower() with
                   | p when p.Contains "nuget.targets" -> Some e
                   | p when p.Contains "microsoft.bcl.build.targets" -> Some e
                   | _ -> None 
                )
                |> Seq.toArray
            let targetElementsToRemove =
                d.GetElementsByTagName "Target"
                |> toElements
                |> Seq.map (fun e ->
                    match e.GetAttribute("Name").ToLower() with
                    | n when n.Contains "ensurebclbuildimported" -> Some e
                    | n when n.Contains "ensurenugetpackagebuildimports" -> Some e
                    | _ -> None
                )
                |> Seq.toArray
            Seq.concat ([|importElementsToRemove; targetElementsToRemove|])
            |> excludeNones
            |> Seq.map (fun x -> 
                x.ParentNode.RemoveChild x |> ignore
                true 
            )
        )
    
This one removes duplicate entries from `packages.config` files:

    let dedupePackages sourcePath =
        printfn "De-duping packages in %s..." sourcePath
        getFiles sourcePath "packages.config"
        |> processFilesXml (fun d ->
            let elementHash = ref Map.empty            
            d.GetElementsByTagName "package"
            |> toElements
            |> Seq.map (fun e ->
                let id = e.GetAttribute "id"
                match elementHash.Value.ContainsKey id with
                | true -> Some e
                | false ->
                    elementHash.Value <- elementHash.Value.Add(id, true)
                    None
            )
            |> Seq.toArray
            |> excludeNones
            |> Seq.map (fun x ->
                x.ParentNode.RemoveChild x |> ignore
                true 
            )
        )

None of my projects want to target specific versions of assemblies. That is just tempting the binding redirects monster. So they have got to go.
    
    let removeReferenceVersions sourcePath =
        printfn "Removing reference versions from %s..." sourcePath
        getFiles sourcePath "*.csproj"
        |> processFilesLines (fun ls ->
            ls
            |> Seq.map (fun l ->
                match l with
                | line when (line.Trim().StartsWith "<Reference Include=\"") && (line.Contains ",") && not (line.Contains "processorArchitecture=AMD64") ->
                    let xml = line.Trim()
                    let endTag = match xml.EndsWith ">" with true -> "</Reference>" | _ -> ""
                    let doc = XmlDocument()
                    doc.LoadXml (sprintf "%s%s" xml endTag)
                    doc.DocumentElement.SetAttribute("Include", ((doc.DocumentElement.GetAttribute "Include").Split ',').[0])
                    doc.DocumentElement.InnerXml <- ""
                    let newXml = doc.DocumentElement.OuterXml.Replace("</Reference>", "")
                    let newXml' = (match xml.EndsWith "/>" with true -> newXml.Replace(">", "/>") | _ -> newXml).Replace("//>", "/>")
                    (true, line.Replace(line.Trim(), newXml'))
                | line -> (false, line)
            )
            |> Seq.toArray            
        )
    
Test setting files and test sections in solutions have got to go:

    let deleteTestSettingFiles sourcePath =
        printfn "Deleting test setting files from %s..." sourcePath
        Seq.concat [|getFiles sourcePath "*.vsmdi"; getFiles sourcePath "*.testsettings"|]
        |> Seq.iter (File.Delete)
    
    let removeSolutionTestSections sourcePath =
        printfn "Removing solution test sections from %s..." sourcePath
        getFiles sourcePath "*.sln"
        |> Seq.map (fun file -> (file, File.ReadAllText file))
        |> Seq.map (fun (file, content) ->
            (file, content, Regex.Match(content, "Project\\([\"\\w\\-\\{\\}]+\\) = \"Solution Items\", \"Solution Items\".+EndProjectSection\r\nEndProject", RegexOptions.Singleline).Value))
        |> Seq.filter (fun (_, _, x) -> not (String.IsNullOrWhiteSpace x))
        |> Seq.map (fun (file, content, solutionItems) -> (file, content.Replace(solutionItems, "")))
        |> Seq.iter (fun (file, content) -> File.WriteAllText(file, content))

Finally, I can call what I need to like so:
    
    let main =
        let sp = @"C:\My_Source_Directory"
        removeBadTargetsAndImports sp
        dedupePackages sp
        removeReferenceVersions sp
        deleteTestSettingFiles sp
        removeSolutionTestSections sp
        0

For now, anyway, I find this is a nice balance and keeps me actively using both C# and F#, one for major application development, and the other one for these tools.
