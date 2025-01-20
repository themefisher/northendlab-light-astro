import config from "@/config/config.json";
import { plainify } from "@/lib/utils/textConverter";
import Fuse from "fuse.js";
import React, { useEffect, useRef, useState } from "react";
const { summary_length } = config.settings;
export type SearchItem = {
  slug: string;
  data: any;
  content: any;
};

interface Props {
  searchList: SearchItem[];
}

interface SearchResult {
  item: SearchItem;
  refIndex: number;
}

export default function SearchBar({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null,
  );

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const fuse = new Fuse(searchList, {
    keys: ["data.title", "data.categories", "data.tags"],
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.5,
  });

  useEffect(() => {
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    setTimeout(function () {
      inputRef.current!.selectionStart = inputRef.current!.selectionEnd =
        searchStr?.length || 0;
    }, 50);
  }, []);

  useEffect(() => {
    let inputResult = inputVal.length > 2 ? fuse.search(inputVal) : [];
    setSearchResults(inputResult);

    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.pushState(null, "", newRelativePathQuery);
    } else {
      history.pushState(null, "", window.location.pathname);
    }
  }, [inputVal]);

  return (
    <div className="min-h-[45vh]">
      <input
        className="form-input w-full"
        placeholder="Search posts"
        type="text"
        name="search"
        value={inputVal}
        onChange={handleChange}
        autoComplete="off"
        autoFocus
        ref={inputRef}
      />

      <div className="row">
        <div className="mx-auto px-0 lg:col-8">
          {inputVal.length > 1 && (
            <h2 className="mt-8 font-normal">
              Found {searchResults?.length}
              {searchResults?.length && searchResults?.length === 1
                ? " result"
                : " results"}{" "}
              for <span className="text-primary">{inputVal}</span>
            </h2>
          )}
          {searchResults?.length ? (
            <div className="rounded py-12 px-9 shadow md:p-[60px]">
              {searchResults?.map(({ item }) => (
                <div
                  className="card mb-12 border-b border-border pb-[30px]"
                  key={item.slug}
                >
                  <h3 className="h4">
                    <a
                      href={`/posts/${item.slug}`}
                      className="block font-normal text-primary hover:underline"
                    >
                      {item.data.title}
                    </a>
                  </h3>
                  <p className="mt-2.5 text-lg text-text">
                    {plainify(item.content?.slice(0, Number(summary_length)))}
                  </p>
                  <p className="mt-3 text-lg">
                    Categories:{" "}
                    {item.data.categories?.map(
                      (category: string, index: number) => (
                        <a key={index} href="#">
                          {category}
                        </a>
                      ),
                    )}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
