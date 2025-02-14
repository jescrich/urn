# URN Utility

This package provides a utility for working with Uniform Resource Names (URNs). It allows you to compose, validate, and extract information from URN strings.

## Installation

This package is not yet published. To use it, you'll need to clone the repository and link it locally or install it directly from GitHub (once it's published). Assuming a typical npm/yarn setup:

1.  **Clone the repository:**

    
    git clone <repository_url>
    
2.  **Navigate to the directory:**

    
    cd <repository_directory>
    
3.  **Install dependencies (if any):**

    
    npm install
    
    or
    
    yarn install
    

4.  **Link the package (for local development):**

    
    npm link
    

    Then, in your project where you want to use the `Urn` class:

    
    npm link <package-name> # Replace <package-name> with the actual name from package.json
    

    *OR*

    **Install directly from GitHub (once published or if you have a direct link):**

    
    npm install github:<username>/<repository>#<branch>
    
    (Replace `<username>`, `<repository>`, and `<branch>` with the appropriate values.  The `#<branch>` part is optional, defaulting to the main/master branch.)

## Usage

The `Urn` class provides static methods for working with URNs.

### 1. Composing a URN

Use the `compose` method to create a URN string from its components.


import { Urn } from './urn'; // Adjust the import path as needed

const urnString = Urn.compose({
  entity: 'document',
  id: '123',
  attributes: {
    vendor: 'foo',
    version: '1.0',
  },
});

console.log(urnString); // Output: urn:document:123:vendor:foo:version:1.0

