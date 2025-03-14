
<br />
<div align="center">
  <a href="https://github.com/mryan5072/Game-Site">
    <img src="https://i.gyazo.com/44835d6c6fd96ce1878240d81e220de1.png" alt="Logo" width="176" height="34">
  </a>

  <h3 align="center">Game Tracker</h3>

  <p align="center">
    A web app to search, review and track your favorite video games!
    <br />
    <a href="https://github.com/mryan5072/Game-Site"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://game-site-red.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/mryan5072/Game-Site/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/mryan5072/Game-Site/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

## Table of Contents

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

[![Product Screenshot][product-screenshot]](https://example.com)

Game Tracker is a web application that allows users to search, review and track video games. Built in **Next.js**, the app seamlessly integrates the **IGDB API** to retrieve detailed game information while offering a dynamic and interactive user experience.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Next][Next.js]][Next-url]
* [![Firebase][Firebase]][Firebase-url]
* [![MUI][MUI]][MUI-url]
* [![IGDB][IGDB]][IGDB-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js (v16+)
  ```sh
  npm install npm@latest -g
  ```
* IGDB API access (Client ID and Token)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/mryan5072/game-tracker.git
   ```
2. Install dependencies
   ```sh
   npm install
   ```
3. Create a `.env.local` file with your credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   IGDB_CLIENT_ID=your_igdb_client_id
   IGDB_ACCESS_TOKEN=your_igdb_access_token
   ```
4. Run the development server
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

- **Search for Games**: Use the IGDB API to find game details by name.
- **Review and Rate**: Leave star ratings and comments for any game.
- **Track Games**: Mark off games you have played or simply want to keep an eye on.
- **Dynamic Ratings**: Aggregate ratings are updated in real-time.

_For a detailed example, visit the [Live Demo](https://game-site-red.vercel.app/)._  

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

- **User Ratings and Reviews**: Integrates Firebase Firestore to store user-generated ratings and comments.
- **Real-Time Aggregated Data**: Calculate and display average ratings dynamically based on user input.
- **Responsive Design**: Built with MUI for a seamless experience across devices.
- **Game Information Retrieval**: Powered by IGDB API to show detailed information about video games.
- **Next.js Framework**: Optimized for fast performance and SEO.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [ ] Add user authentication for personalized reviews
- [ ] Allow editing/deleting of user reviews
- [ ] Add game recommendation features
- [ ] Improve UI with sorting and filtering options

See the [open issues](https://github.com/mryan5072/Game-Site/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make the open-source community amazing! Any contributions are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Matthew Ryan - mryan5072@gmail.com

Project Link: [https://github.com/mryan5072/Game-Site](https://github.com/mryan5072/Game-Site)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

* [Next.js Documentation](https://nextjs.org/docs)
* [Firebase Documentation](https://firebase.google.com/docs)
* [IGDB API](https://api-docs.igdb.com)
* [MUI Components](https://mui.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: https://i.gyazo.com/40512041b49c9f716771837b32674235.jpg
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Firebase]: https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black
[Firebase-url]: https://firebase.google.com/
[MUI]: https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white
[MUI-url]: https://mui.com/
[IGDB]: https://img.shields.io/badge/IGDB-000000?style=for-the-badge&logo=gamepad&logoColor=white
[IGDB-url]: https://www.igdb.com/
