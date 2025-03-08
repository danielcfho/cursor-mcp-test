# Cursor MCP Test

A test repository created using Cursor MCP for iOS/macOS app development.

## Project Overview

This repository serves as a template for building universal SwiftUI applications that work seamlessly across iOS and macOS platforms.

## Features

- Modern SwiftUI architecture
- Clean, modular code structure
- Support for both iOS and macOS
- Dark mode compatibility
- Dynamic type support
- Responsive layouts

## Project Structure

The project follows a feature-based organization:

```
CursorMCPTest/
├── App/
│   └── CursorMCPTestApp.swift
├── Features/
│   ├── Feature1/
│   │   ├── Models/
│   │   ├── Views/
│   │   ├── ViewModels/
│   │   └── Services/
│   └── Feature2/
│       ├── Models/
│       ├── Views/
│       ├── ViewModels/
│       └── Services/
├── Core/
│   ├── Extensions/
│   ├── Utilities/
│   └── Networking/
└── Resources/
    ├── Assets.xcassets/
    └── Localizations/
```

## Getting Started

### Prerequisites

- Xcode 15.0+
- Swift 5.9+
- iOS 17.0+ / macOS 14.0+

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/danielcfho/cursor-mcp-test.git
   ```

2. Open the project in Xcode
   ```bash
   cd cursor-mcp-test
   open CursorMCPTest.xcodeproj
   ```

3. Build and run the application

## Development Guidelines

- Write clean, modular code
- Follow Swift naming conventions
- Use SwiftUI for UI development
- Implement proper error handling
- Write unit tests for business logic
- Support accessibility features

## Dependencies

Dependencies are managed using Swift Package Manager:

- [Example Package](https://github.com/example/package) - Description of what this package does

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Apple's [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- Swift and SwiftUI documentation