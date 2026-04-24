class API {
  constructor() {
    this.apiUrl = "https://jsonplaceholder.typicode.com/posts";
  }

  getPosts = async (query = "", page = 1, limit = 10) => {
    const url = query
      ? `${this.apiUrl}?q=${query}&_page=${page}&_limit=${limit}`
      : `${this.apiUrl}?_page=${page}&_limit=${limit}`;

    console.log(url);

    let response;
    try {
      response = await fetch(url);
    } catch {
      throw new Error("No internet connection");
    }

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Server returned an invalid response");
    }

    return data;
  };
}
