import algoliasearch from "algoliasearch/lite";
import { useState } from "react";
import {
  Hits,
  InstantSearch,
  RefinementList,
} from "react-instantsearch-hooks-web";

type AlgoliaWrapperProps = {
  propToForceRerender: string;
};

function AlgoliaWrapper({ propToForceRerender }: AlgoliaWrapperProps) {
  const appId = "RHVCHJW67L";
  const indexName = "demo_content";
  // It's okay for this key to be public
  const apiKey = "5e56001b6c4b76edb3d2b69ca5951b75";
  const [searchClient] = useState(algoliasearch(appId, apiKey));

  // Basic initialUiState
  // This gets used on the first render, but seems to be ignored on the second render (even though it's still here and passed as a prop as usual)
  const initialUiState = {
    [indexName]: {
      refinementList: {
        "metadata.tags.sys.id": ["blog"],
      },
    },
  };

  console.log("AlgoliaWrapper rendered", propToForceRerender);

  return (
    <InstantSearch
      indexName={indexName}
      searchClient={searchClient}
      initialUiState={initialUiState}
    >
      <div>
        <RefinementList
          attribute="metadata.tags.sys.id"
          // Using example code from https://www.algolia.com/doc/api-reference/widgets/refinement-list/react-hooks/#widget-param-transformitems
          transformItems={(items) => {
            return items.map((item) => ({
              ...item,
              label: item.label.toUpperCase(),
            }));
          }}
        />
      </div>
      <div>
        <Hits />
      </div>
    </InstantSearch>
  );
}

export default function Index() {
  const [value, setValue] = useState("test1");
  setTimeout(() => {
    console.log("Updating a test prop to force AlgoliaWrapper to re-render");
    setValue("test2");
  }, 2000);
  return (
    <div>
      <AlgoliaWrapper propToForceRerender={value} />
    </div>
  );
}
