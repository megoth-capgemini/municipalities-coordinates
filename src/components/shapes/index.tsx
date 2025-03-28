import codeShaclC from "../../../shapes/service.shaclc?raw";
import codeShacl from "../../../shapes/service.shacl?raw";
import codeShex from "../../../shapes/service.shex?raw";
import clsx from "clsx";
import { useEffect, useState } from "react";
import usePrism from "../../hooks/use-prism";

type Tab = {
  label: string;
};

export default function Shapes() {
  const highlightAll = usePrism();
  const shaclC = { label: "SHACLC" };
  const shacl = { label: "SHACL" };
  const shex = { label: "ShEx" };
  const tabs: Array<Tab> = [shaclC, shacl, shex];
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  useEffect(highlightAll, [activeTab]);
  return (
    <section>
      <div className="bulma-tabs">
        <ul>
          {tabs.map((tab) => (
            <li
              key={tab.label}
              className={clsx({ "bulma-is-active": tab.label === activeTab })}
            >
              <a onClick={() => setActiveTab(tab.label)}>{tab.label}</a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <pre className="line-numbers">
          {activeTab === shaclC.label && (
            <code className="language-turtle">{codeShaclC}</code>
          )}
          {activeTab === shacl.label && (
            <code className="language-turtle">{codeShacl}</code>
          )}
          {activeTab === shex.label && (
            <code className="language-turtle">{codeShex}</code>
          )}
        </pre>
      </div>
    </section>
  );
}
