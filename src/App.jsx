import "./App.css";
import { useState } from "react";

function App() {
  const [display, setDisplay] = useState("");

  const handleClick = (value) => {
    setDisplay(display + value);
  };

  return (
    <>
      <div className="contenedor">
        <div className="calculadora">
          <input type="text" placeholder="0" value={display} readOnly />
          <div className="teclado">
            <div className="numeros">
              <button className="uno" onClick={() => handleClick("1")}>1</button>
              <button onClick={() => handleClick("2")}>2</button>
              <button className="tres" onClick={() => handleClick("3")}>3</button>
              <button onClick={() => handleClick("4")}>4</button>
              <button onClick={() => handleClick("5")}>5</button>
              <button onClick={() => handleClick("6")}>6</button>
              <button className="siete" onClick={() => handleClick("7")}>7</button>
              <button onClick={() => handleClick("8")}>8</button>
              <button className="nueve" onClick={() => handleClick("9")}>9</button>
              <br></br>
              <button className="cero" onClick={() => handleClick("0")}>0</button>
            </div>
            <div className="signos">
              <button className="C" onClick={() => setDisplay("")}>C</button>
              <button className="borrar" onClick={() => setDisplay(display.slice(0, -1))}>⌫</button>
              <button onClick={() => handleClick("+")}>+</button>
              <button onClick={() => handleClick("-")}>-</button>
              <button onClick={() => handleClick("*")}>×</button>
              <button className="division" onClick={() => handleClick("/")}>÷</button>
              <button className="igual" onClick={() => setDisplay(eval(display))}>=</button>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <p>Calculadora de Lucas</p>
      </footer>
    </>
  );
}

export default App;
