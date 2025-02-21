import React from "react";

const Spinner = () => (
    <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "500px" // Центрируем внутри будущего графика
    }}>
        <div style={{
            width: "40px",
            height: "40px",
            border: "5px solid rgba(255, 255, 255, 0.3)",
            borderTop: "5px solid white",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
        }} />
        <style>
            {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}
        </style>
    </div>
);

export default Spinner;
