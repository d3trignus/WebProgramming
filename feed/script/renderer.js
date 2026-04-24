class Renderer {
  constructor(api) {
    this.api = api;

    this.timer = null;
    this.page = 1;
    this.isLoading = false;
    this.observer = null;

    this.feed = document.querySelector("#feed");
    this.searchInput = document.querySelector("#search-input");

    this.initEventListeners();
  }

  initEventListeners = () => {
    this.searchInput.addEventListener("input", () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.updateFeed();
      }, 1000);
    });

    this.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        clearTimeout(this.timer);
        this.updateFeed();
      }
    });
  };

  showLoader = () => {
    this.hideLoader();
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.textContent = "Loading...";
    this.feed.appendChild(loader);
  };

  hideLoader = () => {
    const loader = document.querySelector("#loader");
    if (loader) loader.remove();
  };

  showError = (message, append = false) => {
    this.hideError();
    const error = document.createElement("div");
    error.id = "error";
    error.textContent = message;
    if (!append) {
      this.feed.innerHTML = "";
    }
    this.feed.appendChild(error);
  };

  hideError = () => {
    const error = document.querySelector("#error");
    if (error) error.remove();
  };

  updateFeed = async () => {
    this.page = 1;
    if (this.observer) this.observer.disconnect();

    this.feed.innerHTML = "";
    this.showLoader();

    try {
      const query = this.searchInput.value;
      const posts = await this.api.getPosts(query, this.page);
      this.hideLoader();
      this.renderPosts(posts);
      this.setupIntersectionObserver();
    } catch (e) {
      this.hideLoader();
      this.showError(e.message);
    }
  };

  loadMore = async () => {
    if (this.isLoading) return;

    this.isLoading = true;
    this.page++;

    this.showLoader();

    try {
      const query = this.searchInput.value;
      const posts = await this.api.getPosts(query, this.page);
      this.hideLoader();

      if (posts.length > 0) {
        this.renderPosts(posts, true);
        this.setupIntersectionObserver();
      } else {
        if (this.observer) this.observer.disconnect();
      }
    } catch (e) {
      this.hideLoader();
      this.showError(e.message, true);
    } finally {
      this.isLoading = false;
    }
  };

  setupIntersectionObserver = () => {
    if (this.observer) this.observer.disconnect();

    const sentinel = document.createElement("div");
    this.feed.appendChild(sentinel);

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.loadMore();
      }
    });

    this.observer.observe(sentinel);
  };

  renderPosts = (posts, append = false) => {
    if (!append) {
      this.feed.innerHTML = "";
      this.postCount = 0;
    }

    if (posts.length === 0 && !append) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = `<h1>Nothing found</h1><p>Try a different search query</p>`;
      this.feed.appendChild(empty);
      return;
    }

    posts.forEach((post) => {
      this.postCount = (this.postCount || 0) + 1;
      const postEl = document.createElement("div");
      postEl.classList.add("post");
      postEl.innerHTML = `
        <div class="post-index"># ${String(this.postCount).padStart(3, "0")}</div>
        <h3>${post.title}</h3>
        <p>${post.body}</p>
      `;
      this.feed.appendChild(postEl);
    });
  };
}
