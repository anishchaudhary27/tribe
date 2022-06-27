import { createElement, Fragment, useEffect, useRef } from "react";
import { autocomplete, getAlgoliaResults } from "@algolia/autocomplete-js";
import "@algolia/autocomplete-theme-classic";
import { algolia } from "../algolia";
import { useNavigate } from "react-router-dom";
import { render } from "react-dom";
import Avatar from "boring-avatars";

export default function Autocomplete(props: any) {
  const containerRef = useRef<any>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const search = autocomplete({
      container: containerRef.current,
      renderer: {
        createElement,
        Fragment,
      },
      render({ children }, root) {
        render(children, root);
      },
      getSources: () => [
        {
          sourceId: "querySuggestions",
          getItemInputValue({ item, state }) {
            return item.query;
          },
          getItems({ query }) {
            return getAlgoliaResults({
              searchClient: algolia,
              queries: [
                {
                  indexName: "users",
                  query,
                  params: {
                    hitsPerPage: 5,
                  },
                },
              ],
            });
          },
          templates: {
            item({ item, components }) {
              return (
                <div className="flex flex-1 items-center">
                  {Boolean(item.animateAvatar) && (
                    <Avatar
                      size={40}
                      variant="beam"
                      name={String(item.name)}
                      colors={[
                        "#FFAD08",
                        "#EDD75A",
                        "#73B06F",
                        "#0C8F8F",
                        "#405059",
                      ]}
                    />
                  )}
                  {Boolean(item.animateAvatar) === false && (
                    <img
                      className="h-[40px] w-[40px] rounded-full bg-gray-500"
                      src={`${import.meta.env.VITE_API_ENDPOINT}/avatar/${
                        item.objectID
                      }`}
                    />
                  )}
                  <div className="ml-4">
                    <p className=" text-xl text-slate-700 " >{String(item.name)}</p>
                    <p className="text-sm text-slate-500 " >@{String(item.handle)}</p>
                  </div>
                </div>
              );
            },
          },
          onSelect(params) {
            navigate("/profile/" + String(params.item.handle));
          },
        },
      ],
      ...props,
    });

    return () => {
      search.destroy();
    };
  }, [props]);
  return <div ref={containerRef} />;
}
