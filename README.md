# **URN Utility** (`@jescrich/urn`)

[![Publish Package](https://github.com/jescrich/urn/actions/workflows/publish.yml/badge.svg)](https://github.com/jescrich/urn/actions/workflows/publish.yml) [![npm version](https://badge.fury.io/js/@jescrich%2Furn.svg)](https://badge.fury.io/js/@jescrich%2Furn)

A lightweight utility for composing, validating, and extracting information from **Uniform Resource Names (URNs)**.  
URNs provide **persistent, structured identifiers** for resources across systems.

## **Installation**

```sh
npm install @jescrich/urn
```

or using Yarn:

```sh
yarn add @jescrich/urn
```

## **Usage**

URNs follow the format:  
```txt
urn:<entity>:<id>[:<key>:<value>]*
```

### **Examples**
```txt
urn:customer:jescrich@sampledomain.com
urn:customer:6e8bc430-9c3a-11d9-9669-0800200c9a66
urn:order:12345:vendor:mercadolibre
urn:document:abc123:type:pdf:author:john_doe
urn:isbn:0-486-27557-4
urn:uuid:6e8bc430-9c3a-11d9-9669-0800200c9a66
urn:nbn:de:bvb:19-146642
```

---

## **API Reference**

### **1. Compose a URN**
Create a URN string with an entity, ID, and optional key-value attributes.

```ts
import { Urn } from "@jescrich/urn";

const urn = Urn.compose({ entity: "order", id: "12345", attributes: { vendor: "amazon", status: "shipped" } });
console.log(urn); 
// Output: urn:order:12345:vendor:amazon:status:shipped
```

---

### **2. Extract Information from a URN**
#### **Get the entity type**
```ts
const entity = Urn.entity("urn:order:12345");
console.log(entity); // Output: order
```

#### **Get the unique identifier**
```ts
const id = Urn.id("urn:order:12345");
console.log(id); // Output: 12345
```

#### **Retrieve a specific attribute**
```ts
const vendor = Urn.value("urn:order:12345:vendor:ebay", "vendor");
console.log(vendor); // Output: ebay
```

#### **Retrieve all attributes as an object**
```ts
const attributes = Urn.getAllAttributes("urn:document:abc123:type:pdf:author:john_doe");
console.log(attributes); 
/* Output:
{
  type: "pdf",
  author: "john_doe"
}
*/
```

#### **Extract the vendor specifically**
```ts
const vendor = Urn.vendor("urn:order:5678:vendor:shopify");
console.log(vendor); // Output: shopify
```

---

### **3. Validate URNs**
```ts
console.log(Urn.isValid("urn:order:12345")); // Output: true
console.log(Urn.isValid("invalid-string")); // Output: false
```

---

## **URN Specifications**
- URNs are **persistent, globally unique** resource identifiers.
- The **"urn:"** prefix and namespace identifiers are **case-insensitive**.
- Namespace identifiers should follow [IANA registered URNs](https://www.iana.org/assignments/urn-namespaces/urn-namespaces.xhtml).
- **Special characters** must be percent-encoded (e.g., `:` → `%3A`).
- The **maximum length** of a URN is **255 characters**.

---

## **Benefits in Document Databases**
URNs are particularly useful in **distributed databases, document management, and content storage systems** due to their stability and uniqueness.

1. **Globally Unique Identification**  
   URNs ensure unique, non-colliding identifiers across different systems.

2. **Persistence**  
   Unlike URLs, URNs remain valid even if resource locations change.

3. **Namespace Organization**  
   Helps categorize resources systematically using structured namespaces.

4. **Cross-Database References**  
   Facilitates robust linking between distributed databases and services.

5. **Data Migration & Replication**  
   Maintains identifier consistency during database migrations.

6. **Source Tracking**  
   The structured format (`urn:<namespace>:<id>`) makes it easy to identify the origin of an ID.

---

## **Common Use Cases**
URNs are widely adopted in:
- Digital libraries & archives
- Academic research repositories
- Legal & government document storage
- Healthcare record management
- Digital asset management
- Distributed content management systems (CMS)

---

## **License**
This project is licensed under the **MIT License**.
