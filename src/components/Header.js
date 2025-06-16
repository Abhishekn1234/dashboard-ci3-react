import Production from "./Production";
import React, { useState } from "react";
import Quality from "./Quality";
import Maintenance from "./Maintenance";
import Inventory from "./Inventory";
import Analytics from "./Analytics";
export default function Header() {
  const [activeTab, setActiveTab] = useState("Production");
  const tabs = ["Production", "Quality", "Maintenance", "Inventory", "Analytics"];

  return (
    <>
      {/* Navigation Bar */}
      <div className="d-flex border-bottom">
        {tabs.map((tab) => (
          <a
            key={tab}
            href={`#${tab.toLowerCase()}`}
            className={`me-4 pb-2 text-decoration-none ${
              activeTab === tab
                ? "border-bottom border-3 border-primary text-primary fw-bold"
                : "text-dark"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(tab);
            }}
          >
            {tab}
          </a>
        ))}
      </div>

      
      <div className="mt-3">
        
    {activeTab === "Production" ? (
          <Production />
        ) : activeTab === "Quality" ? (
          <Quality />
        ) : activeTab === "Maintenance" ? (
          <Maintenance />
        ) : activeTab === "Inventory" ? (
         
          <Inventory/>
        ) : activeTab === "Analytics" ? (
          <Analytics/>
        ) : (
          
          null
        )}
      </div>
    </>
  );
}