---
title: PASS Summit 2011 Notes
slug: pass-summit-2011-notes
aliases:
- /blog/pass-summit-2011-notes
date: 2011-11-19
draft: false
tags:
- sql
- sqlserver
- mssql
- bi
- olap
- ssrs
- ssis
- ssas
---
**PASS (Professional Association for SQL Server)** is “an independent, user-led, not-for-profit organization co-founded by Microsoft and CA in 1999. PASS Summit is the world's largest, most-focused, and most-intensive conference for Microsoft SQL Server and BI professionals.” (Source: the PASS website at [sqlpass.org](sqlpass.org)). The summit is held every year in Seattle. This year, the summit was held from October 11 to October 14 and focused on the upcoming RTM launch of SQL Server Denali, now re-branded as SQL Server 2012. The RTM will be released in the first half of 2012. Microsoft claims it is the biggest release of the SQL Server suite they have done so far with hundreds of enhancements. Some are general such as performance enhancements for the RDBMS as well as SSAS and SSIS. Another notable enhancement is that the cloud version of SQL Server (SQL Azure) is now built using the same codebase as the on-premise version. This write-up outlines some of the other enhancements that were highlighted at the summit.

### Relational Database (SQL Server 2012)

#### AlwaysOn
This is the new availability solution that combines clustering and replication and provides an easy-to-configure management UI as part of SSMS. One can configure availability groups made up of multiple geographically distributed nodes and set up failover and replication options between them. There was a demo that involved an AlwaysOn cluster with a node in NY (primary) and another in NJ. A SSRS report was run and while it rendered, the SQL Server in the NY node was stopped. The report seamlessly failed over to the NJ instance.

#### Interoperability enhancements

+ ODBC driver for Linux i.e. for Linux applications wishing to connect to SQL Server
+ New native SQL Server drivers Java and PHP

#### Column-Store Index
This has been positioned as “VertiPaq for relational” and is available as a new index type. It has supposedly led to performance gains of over 150x in tests.

#### Semantic Search
This takes “Full Text Search” one step further and provides AI-like search capabilities based on semantic matching. There was a demo that scanned through several PDF documents and came up with results that were similar to the PDF document that was provided as input.

#### Other Enhancements

+ There is a new FileTable construct that can be used to map disk files as data objects.
+ StreamInsight was introduced in 2008 R2 and is a high-speed complex event processor (100,000 events per second) that can be placed in front of an Enterprise Service Bus solution such as BizTalk Server to handle very high-speed real time data events and update requirements. This release adds high availability features for StreamInsight.

### Data Warehousing & ETL
Major highlights in this section include enhancements to SSIS, Hadoop integration, Data Explorer and the next version of Parallel Data Warehouse. Also worth noting is how Windows Azure Marketplace has been positioned as a place in the cloud to go get reference and real world “lookup” data for integration needs. Another feature worth noting is Data Quality Services – another cloud based service that can assess the quality of your data and suggest corrections where needed. There was a demo that showed how it corrected address values in a geographical dataset. They used the SSRS 2008 R2 geospatial reporting feature for this demo.

#### SQL Server Integration Services (SSIS) 2012
##### Server, not a service
SSIS is now a “server” instead of a “service”. What I understand it to mean is that there is now better support for processing across distributed nodes. The messaging was a bit vague however.

##### Master Data Services and Data Quality Services
There are improvements to how it interacts with Master Data Services (introduced in 2008 R2), which is a master reference data management service, and also enhancements to how it integrates with Data Quality Services as introduced above.

There is better administration experience with simplified deployment and configuration, automatic logging, a management dashboard, built-in reports for troubleshooting and an overall improved SSMS management experience.

##### Project Deployment (ISPAK)
There is a new project and deployment concept which makes deployment easier – what this means is support for multiple packages and configuration to be built as a project into one single deployable unit (i.e. an ISPAK file – pronounced “icepack”). The XML format of the DTSX package has been greatly enhanced and simplified, and is easier to work with source control now.

##### Data taps and scripting enhancements
“Data taps” seems to be a cool new feature. During package runtime, you can use T-SQL or PowerShell to put “wire taps” on data flow paths to “eavesdrop” and create dumps to see what data is being passed through. This should prove very useful for debugging. There is a lot more scripting support – both using T-SQL as well as PowerShell. You can use scripts to get component timing, row count, etc. at run-time.

##### The SSISDB Catalog
Much like how SQL Server stores a lot of its configuration in the “master” database – thus making it easy to read or modify settings using T-SQL scripts, SSIS also has a “SSISDB” catalog that can be worked with in the same away.

##### Change Data Capture
The Change Data Capture feature which can be used to detect changes in data and merge changes (thus allowing for better incremental loading) have been enhanced for SQL Server, and this feature now also supports Oracle.

##### Component enhancements

+ There are new ODBC data source and data destination components that are supposed to perform better than the current OLE DB components.
+ Shared connection managers between packages are supported, which also means that packages can now share in-memory cache of data for lookup and other purposes.

#### Hadoop
Microsoft will work with HortonWorks to provide a distribution of Apache Hadoop that runs on Windows Server and Windows Azure. It will also provide an ODBC driver and an Excel add-in for HIVE, as well as a JavaScript framework for Hadoop. A SQL Server and a SQL Server PDW connector for Hadoop are already available. There was a demo that involved analysis of weblogs across distributed Hadoop nodes. They used a HIVE query to get data into a PowerPivot sheet in Excel and do some analysis. Although it is at early research stage, work seems to be ongoing for Enterprise Data Manager – a bridge solution for real-time communication between disparate Hadoop and SQL Server databases – one that is more graceful than Sqoop and does involve data movement.

#### Data Explorer
If you think of PowerPivot as self-service BI, this would be somewhat like self-service lightweight ETL. This is a web-based data integration tool that lets you bring in data from different sources such as SQL Azure databases, Excel spreadsheets, etc. It also recommends datasets from the Windows Azure Datamarket that you may want to join with.

#### Parallel Data Warehouse V2
Enhancements to the PDW include performance gains and a distributed cost-based query optimizer. There are new PDW appliances from Dell and HP. Microsoft seems to claim that for structured data that has not hit the petabyte range, PDW is still a better solution than NoSQL when you start doing complex queries.

### BI, OLAP & Reporting
#### SQL Server Analysis Services (SSAS) 2012

+ The biggest news is the introduction of the new BI Semantic Model (BISM) as part of the Analysis Services server. The VertiPaq engine is built into SSAS and you can now use Visual Studio to build VertiPaq based cubes and deploy to the server.
+ BISM is what Microsoft uses to describe its overall OLAP data model. What used to be UDM is now BISM Multidimensional and there are a few enhancements to this as well, but nothing that is specifically highlighted at the summit.
+ The new model that follows PowerPivot is BISM Tabular. It has a few enhancements as well (see PowerPivot V2 in the next section). Just like BISM Multidimensional supports MOLAP and ROLAP, BISM Tabular supports two modes- VertiPaq and DirectQuery – DirectQuery being similar to ROLAP for the tabular world.

#### PowerPivot V2
PowerPivot V2, or more specifically BISM Tabular, now supports the following features, among others:

+ KPIs
+ Descriptions
+ Persisted formatting
+ Advanced sorting
+ Distinct count
+ Drill-through
+ Perspectives
+ Hierarchies
+ Row security

#### SQL Server Reporting Services (SSRS) 2012

+ Project Crescent, now rebranded Power View, is part of SSRS. That is covered in detail in the next section. There is a better SharePoint-integrated mode in SSRS, especially because that is how Power View will run – through SharePoint on top of SSRS in SharePoint-integrated mode.
+ “Data alerts” was another highlighted feature at the summit. End users can subscribe to data alerts in their reports that tell them that the data has changed and it is time to refresh. Data alerts can be sent via e-mail, among other things.
 
#### Power View (f.k.a. “Project Crescent”)
Power View is a web-based ad-hoc report design and delivery tool. It is built using Silverlight and runs on SharePoint using SSRS in SharePoint-integrated mode. It supports all the major smart-phone and tablet platforms including iOS and Android. One can build and format reports based on PowerPivot or BISM Tabular models that are deployed to the server. The design interface is presentation-ready.

Power View is meant to complement the existing BI reporting stack that Microsoft has. You’ve got SSRS for creating glossy printed reports and PerformancePoint Services in SharePoint for dashboards, KPI’s and scorecards. Power View positions itself as the tool for ad-hoc analytics and ad-hoc reports. It only runs DAX and is thus able to talk only to BISM Tabular (or PowerPivot) cubes. The first service pack to 2012 will add support for BISM Multidimensional by enhancing Multidimensional to support DAX.

Power View has an interesting Export to PowerPoint feature that lets you export charts, graphs, etc. to PowerPoint and maintains a live link between the PowerPoint slide and the underlying data so that you can get to the live Power View instance from PowerPoint or even have the PowerPoint slide refreshed to use the latest data.

### Developer Experience

+ One of the big pain points when Visual Studio 2010 came out was the lack of BIDS functionality. You still needed Visual Studio 2008 to do any BI development. This has gone away with 2012 – Visual Studio 2010 will support BI and database development.

+ BIDS is being replaced with SQL Server Data Tools (previously known as Juneau) which includes BI as well as database development capabilities. The message is this makes Visual Studio truly the place to develop EVERY single thing, with SSMS being more management focused.

+ There is a DAX Editor plug-in available for Data Tools that is similar to an MDX Script editor with IntelliSense, color coding, etc.

+ The SSIS developer experience is vastly improved with support for .NET 4.0, features such as Undo/Redo, expression markers on icons, auto-save project recovery, etc.

+ PowerPivot for Excel now includes a data modeling diagram view – something that was visibly lacking in the first version.