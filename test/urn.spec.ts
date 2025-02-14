import { Urn } from "@this/urn";

describe('URN', () => {
  it('should return entity name', async () => {
    // Arrange
    const urn = 'urn:orders:1234';

    // Act
    const result = Urn.entity(urn);

    // Assert
    expect(result).toBe('orders');
  });

  it('should return entity id', async () => {
    // Arrange
    const urn = 'urn:orders:1234';

    // Act
    const result = Urn.id(urn);

    // Assert
    expect(result).toBe('1234');
  });


  it('should return any other value in a complex urn', async () => {
    // Arrange
    const urn = 'urn:orders:1234:vendorCode:abcd';

    // Act
    const result = Urn.value(urn, 'vendorCode');

    // Assert
    expect(result).toBe('abcd');
  });

  it('should return product code based on a product urn', async () => {
    const urn = 'urn:product:65b2713b1267994147953b27:vendor:foo:sku:999';

    const result = Urn.value(urn, 'sku');

    expect(result).toBe('999');
  });

  it('should NOT value for a non key', async () => {
    const urn = 'urn:product:65b2713b1267994147953b27:vendor:foo:sku:123';

    const result = Urn.value(urn, 'foo');

    expect(result).toBe(null);
  });
});
