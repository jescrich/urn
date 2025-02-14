import { v4 as uuidv4 } from 'uuid';
export class Urn {
  private static readonly URN_PATTERN = /^urn:([^:]+):([^:]+)(?::([^:]+):([^:]+))*$/;

  /** Generate a URN with a new UUID as the identifier */
  static createUUID(entity: string = 'uuid'): string {
    const newId = uuidv4();
    return Urn.compose({ entity, id: newId });
  }
  

  /**
   * Composes a URN (Uniform Resource Name) string from the given parts.
   *
   * @param parts - An object containing the following properties:
   *   - `entity`: The entity part of the URN (required).
   *   - `id`: The identifier part of the URN (required).
   *   - `attributes`: An optional record of additional attributes to include in the URN.
   *
   * @returns The composed URN string.
   *
   * @throws {Error} If either `entity` or `id` is not provided.
   * @throws {Error} If the composed URN exceeds 255 characters in length.
   */
  static compose(parts: { entity: string; id: string; attributes?: Record<string, string> }): string {
    const { entity, id, attributes = {} } = parts;
    if (!entity || !id) {
      throw new Error("Cannot compose URN: 'entity' and 'id' are required");
    }
    // Encode any reserved chars in entity and id
    const safeEntity = encodeURIComponent(entity);
    const safeId = encodeURIComponent(id);
    let urn = `urn:${safeEntity}:${safeId}`;
    for (const [key, value] of Object.entries(attributes)) {
      if (value === undefined || value === null) {
        // Skip undefined attributes (or throw error if preferred)
        continue;
      }
      const safeKey = encodeURIComponent(key);
      const safeValue = encodeURIComponent(value);
      urn += `:${safeKey}:${safeValue}`;
    }
    // Final sanity check on length
    if (urn.length > 255) {
      throw new Error(`Composed URN is too long (${urn.length} chars, max 255)`);
    }
    return urn;
  }

  /**
   * Extracts the entity type from a URN
   * @param urn - The URN string to parse
   * @returns The entity portion of the URN
   * @throws Error if URN format is invalid
   */
  static entity(urn: string): string {
    if (!this.isValid(urn)) throw new Error('Invalid URN format');
    return urn.split(':')[1];
  }

  /**
   * Extracts the identifier from a URN
   * @param urn - The URN string to parse
   * @returns The ID portion of the URN
   * @throws Error if URN format is invalid
   */
  static id(urn: string): string {
    if (!this.isValid(urn)) throw new Error('Invalid URN format');
    return urn.split(':')[2];
  }

  /**
   * Retrieves the value associated with a specific key in the URN
   * @param urn - The URN string to parse
   * @param key - The key to look up
   * @returns The value associated with the key, or null if not found
   * @throws Error if URN format is invalid
   */
  static value(urn: string, key: string): string | null {
    if (!this.isValid(urn)) throw new Error('Invalid URN format');
    const parts = urn.split(':');

    for (let i = 3; i < parts.length - 1; i += 2) {
      if (parts[i] === key) {
        return parts[i + 1];
      }
    }
    return null;
  }

  /**
   * Validates if a string matches the URN format
   * @param urn - The string to validate
   * @returns true if the string is a valid URN, false otherwise
   */
  static isValid(urn: string): boolean {
    if (!urn || urn.length > 255) {
      // length check
      return false;
    }
    try {
      const { entity, id, attributes } = Urn.parse(urn);
      // Example additional check: entity (NID) should be alphanumeric/hyphen per RFC rules
      if (!/^[A-Za-z0-9][A-Za-z0-9-]{1,31}$/.test(entity)) {
        return false; // entity must start with letter/digit and be 2-32 chars :contentReference[oaicite:1]{index=1}
      }
      // (We could add more specific checks here, e.g., UUID format if entity === "uuid")
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Add or update an attribute in the URN. Returns a new URN string.
   */
  static addAttribute(urn: string, key: string, value: string): string {
    const { entity, id, attributes } = Urn.parse(urn);
    // Encode key and value if they contain reserved characters:
    const safeKey = encodeURIComponent(key);
    const safeValue = encodeURIComponent(value);
    attributes[safeKey] = safeValue;
    return Urn.compose({ entity, id, attributes });
  }

  /**
   * Remove an attribute from the URN. Returns the modified URN, or the same URN if not found.
   */
  static removeAttribute(urn: string, key: string): string {
    const { entity, id, attributes } = Urn.parse(urn);
    if (!(key in attributes)) {
      return urn; // no change if key not present (could also throw if strict behavior wanted)
    }
    delete attributes[key];
    return Urn.compose({ entity, id, attributes });
  }

  /**
   * Extracts all key-value pairs from the URN
   * @param urn - The URN string to parse
   * @returns An object containing all key-value pairs found in the URN
   * @throws Error if URN format is invalid
   */
  static getAllAttributes(urn: string): Record<string, string> {
    if (!this.isValid(urn)) throw new Error('Invalid URN format');
    const parts = urn.split(':');
    const attributes: Record<string, string> = {};

    for (let i = 3; i < parts.length - 1; i += 2) {
      attributes[parts[i]] = parts[i + 1];
    }

    return attributes;
  }

  /**
   * Extracts the vendor value from the given URN (Uniform Resource Name).
   *
   * @param urn - The URN string from which to extract the vendor value.
   * @returns The vendor value as a string if present, otherwise null.
   */
  static vendor(urn: string): string | null {
    return this.value(urn, 'vendor');
  }

  /**
   * Normalizes a given URN (Uniform Resource Name) string.
   * 
   * This method parses the URN into its components, then re-composes it
   * using the `Urn.compose` method, which ensures that the prefix is
   * encoded and lowercased. Additionally, it lowercases the entity
   * (namespace) for consistency, as per the specification recommendation.
   * 
   * @param urn - The URN string to be normalized.
   * @returns The normalized URN string.
   */
  static normalize(urn: string): string {
    const { entity, id, attributes } = Urn.parse(urn);
    // Re-compose using our compose which already encodes and lowercases prefix.
    // Lowercase the entity (namespace) for consistency as per spec recommendation.
    return Urn.compose({ entity: entity.toLowerCase(), id, attributes });
  }

  /**
   * Parse a URN string into its components.
   * This function does a single-pass parse for efficiency.
   * @returns An object with entity, id, and attributes.
   * @throws Error if the URN is malformed.
   */
  static parse(urn: string): { entity: string; id: string; attributes: Record<string, string> } {
    // Make parsing case-insensitive for prefix and ensure correct prefix
    if (!urn.toLowerCase().startsWith('urn:')) {
      throw new Error("Invalid URN: Must start with the 'urn:' scheme");
    }
    const content = urn.substring(4); // remove "urn:" prefix
    const parts = content.split(':');
    // The first two parts should be entity and id. After that, key-value pairs.
    if (parts.length < 2) {
      throw new Error('Invalid URN: Missing entity or ID component');
    }
    const [entity, id, ...rest] = parts;
    if (!entity || !id) {
      throw new Error('Invalid URN: Entity or ID is empty');
    }
    // If there are attributes, they should come in key-value pairs
    if (rest.length % 2 !== 0) {
      throw new Error('Invalid URN: Attribute key without value');
    }
    const attributes: Record<string, string> = {};
    for (let i = 0; i < rest.length; i += 2) {
      const key = rest[i];
      const value = rest[i + 1];
      if (!key || !value) {
        throw new Error(`Invalid URN: Attribute ${key} missing value`);
      }
      attributes[key] = value;
    }
    return { entity, id, attributes };
  }
}
