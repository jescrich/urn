export class Urn {
    private static readonly URN_PATTERN = /^urn:([^:]+):([^:]+)(?::([^:]+):([^:]+))*$/;
  
    /**
     * Creates a URN string with the specified components
     * @param params.entity - The entity type (e.g., 'document')
     * @param params.id - The unique identifier
     * @param params.attributes - Optional key-value pairs for additional attributes
     * @returns A properly formatted URN string (e.g., 'urn:document:123:vendor:foo')
     */
    static compose(params: { entity: string; id: string; attributes?: Record<string, string> }): string {
      const { entity, id, attributes } = params;
      let urn = `urn:${entity}:${id}`;
      
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          urn += `:${key}:${value}`;
        });
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
      return this.URN_PATTERN.test(urn);
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
  }