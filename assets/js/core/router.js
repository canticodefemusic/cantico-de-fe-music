
export const Router = {
  params(){ return new URLSearchParams(location.search); },
  page(){ return this.params().get("page") || "home"; },
  id(){ return this.params().get("id"); },
  link(page, id){ return id ? `/?page=${page}&id=${id}` : `/?page=${page}`; }
};
