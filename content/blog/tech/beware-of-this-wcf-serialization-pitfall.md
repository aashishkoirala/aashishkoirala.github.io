---
title: Beware of this WCF Serialization Pitfall
slug: beware-of-this-wcf-serialization-pitfall
aliases:
- /blog/beware-of-this-wcf-serialization-pitfall
date: 2014-12-02
draft: false
tags:
- csharp
- dotnet
- wcf
---
Ideally, one should avoid data contracts with complex graphs- especially with repeated references and definitely ones with circular references. Those can make your payload explode on serialization. With repeated references, you may run into an integrity issue on deserialization. With circular references, the serialization will enter a recursive loop and you will probably run into a stack overflow.

Seeing that in certain situations, this becomes unavoidable, WCF has [a way](https://msdn.microsoft.com/en-us/library/system.runtime.serialization.datacontractattribute.isreference(v=vs.110).aspx) that you can tell it to preserve object references during serialization. You do this by setting _IsReference_ to **true** on the _DataContract_ attribute that you use to decorate the composite type that is your data contract.

So, for example:

	[DataContract(IsReference = true)]
	public class MyContract
	{
	   [DataMember]
	   public string Member1 { get; set; }
	   ...
	   ...
	}

This solves the problem- however, since WCF achieves this by augmenting the WSDL- beware of this when you are exposing your service to third parties (especially ones that are not using WCF or perhaps not .NET at all) and interoperability is a concern. Without _IsReference_ set to **true**, the WSDL snippet for the above would look something like:

	<xs:complexType name="MyContract">
	  <xs:sequence>
		<xs:element minOccurs="0" name="Member1" nillable="true" type="xs:string"/>
		...
	  </xs:sequence>
	</xs:complexType>

With _IsReference_ set to **true**, this is what it looks like:

	<xs:complexType name="MyContract">
	  <xs:sequence>
		<xs:element minOccurs="0" name="Member1" nillable="true" type="xs:string"/>
		...
	  </xs:sequence>
	  **<xs:attribute ref="ser:Id"/>**
	 **<xs:attribute ref="ser:Ref"/>**
	</xs:complexType>

See those two lines that got added (i.e. "Id" and "Ref")? That could very well cause some other party's WSDL parser/proxy generator to choke. You have been warned.