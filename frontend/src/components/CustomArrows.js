import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import '../styles/ItemDetail.css';

export const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
        zIndex: 2,
        right: "-10px",
      }}
      onClick={onClick}
    >
      <FaChevronRight style={{ color: "black", fontSize: "18px" }} />
    </div>
  );
};

export const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
        zIndex: 2,
        left: "-10px",
      }}
      onClick={onClick}
    >
      <FaChevronLeft style={{ color: "black", fontSize: "18px" }} />
    </div>
  );
};