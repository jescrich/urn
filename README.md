Here’s an improved version of your README file with better structure, clarity, and additional details to make it more user-friendly and professional.  

---

# **URN Utility** (`@jescrich/urn`)

A lightweight utility for composing, validating, and extracting information from **Uniform Resource Names (URNs)**.

URNs provide **persistent, location-independent identifiers** for resources across systems, ensuring globally unique, structured references.

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
urn:<namespace>:<specific-string>
```

### **Examples**
```txt
urn:customer:jescrich@sampledomain.com
urn:customer:6e8bc430-9c3a-11d9-9669-0800200c9a66
urn:order:12345:vendor:mercadolibre
urn:isbn:0-486-27557-4
urn:ietf:rfc:2648
urn:uuid:6e8bc430-9c3a-11d9-9669-0800200c9a66
urn:nbn:de:bvb:19-146642
```

### **Basic API Usage**
```ts
import { parseURN, validateURN, createURN } from "@jescrich/urn";

const urn = "urn:customer:12345";

// Validate a URN
console.log(validateURN(urn)); // true or false

// Parse a URN
const parsed = parseURN(urn);
console.log(parsed); 
/* Output:
{
  namespace: "customer",
  id: "12345"
}
*/

// Create a URN
const newUrn = createURN("order", "67890");
console.log(newUrn); // urn:order:67890
```

## **URN Specifications**
- URNs are **persistent, globally unique** resource identifiers.
- The **"urn:"** prefix and namespace identifiers are **case-insensitive**.
- Namespace identifiers should follow [IANA registered URNs](https://www.iana.org/assignments/urn-namespaces/urn-namespaces.xhtml).
- **Special characters** must be percent-encoded (e.g., `:` → `%3A`).
- The **maximum length** of a URN is **255 characters**.

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

## **Common Use Cases**
URNs are widely adopted in:
- Digital libraries & archives
- Academic research repositories
- Legal & government document storage
- Healthcare record management
- Digital asset management
- Distributed content management systems (CMS)

## **License**
This project is licensed under the **MIT License**.

---

This version improves readability, enhances usability with code examples, and clarifies technical concepts. Let me know if you want any further refinements! 🚀