# Bazar.com: A Multi-Tier Online Book Store

### Distributed and Operating Systems  
**Bazar.com - The World's Smallest Book Store**

Bazar.com is a simple, multi-tier online bookstore designed as a distributed application. This project demonstrates a RESTful microservices architecture, with separate components for catalog management and order processing.

## Prerequisites
Before running the project, ensure you have the following installed:

- **Docker**
- **Docker Compose**
- **Node.js** (for local development)

## Project Overview
Bazar.com consists of:
- A **front-end server** that handles user requests.
- A **back-end** with two microservices:
  - **Catalog Server**: Manages book inventory with stock counts, pricing, and topic categorization.
  - **Order Server**: Processes purchase orders and manages inventory updates.

## Key Features
- **Catalog Browsing**: Search and view book details by topic.
- **Order Processing**: Make purchases with automatic inventory updates.
- **RESTful Design**: Each component communicates through HTTP REST APIs, allowing modularity and separation of concerns.

## Setup and Installation

   **Clone the Repository**:
   ```bash
   git clone https://github.com/MasaLubbadeh/DOSProj.git
   cd DOSProj
   **If you are not using Docker**
1. Open folder using vscode or you preffered Editor
2. Navigate into each folder and run each server in separate terminal
![Catalog folder](images/catalog.png)
![Order folder](images/order.png)
![Frontend folder](images/frontend.png)


