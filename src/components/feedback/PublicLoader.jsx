import React, { forwardRef } from "react";
import "@styles/PublicLoader.css";

const PublicLoader = forwardRef(function PublicLoader(_, ref) {
    return (
        <div ref={ref} className="public-loader-overlay">
            <div className="loader">
                <span>
                    <span></span><span></span><span></span><span></span>
                </span>
                <div className="base">
                    <span></span>
                    <div className="face"></div>
                </div>
            </div>
            <div className="longfazers">
                <span></span><span></span><span></span><span></span>
            </div>
        </div>
    );
});

export default PublicLoader;
