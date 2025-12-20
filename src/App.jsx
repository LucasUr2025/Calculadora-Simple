import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [display, setDisplay] = useState("");
  const [expression, setExpression] = useState("");

  const operatorsDisplay = [" + ", " - ", " × ", " ÷ "];
  const isDigit = (ch) => /\d/.test(ch);
  const toEval = (ch) => {
    if (ch === " × ") return "*";
    if (ch === " ÷ ") return "/";
    return ch.trim();
  };

  const lastCharTrim = (s) => s.trim().slice(-1);
  const endsWithOperator = (s) => operatorsDisplay.some((op) => s.endsWith(op));
  const countOpenParens = (s) =>
    (s.match(/\(/g) || []).length - (s.match(/\)/g) || []).length;

  const getLastToken = (s) => {
    const trimmed = s.trim();
    if (!trimmed) return "";
    const parts = trimmed.split(" ");
    return parts[parts.length - 1];
  };

  const lastTokenEndsWithDot = (s) => {
    const token = getLastToken(s);
    return token !== "" && token.endsWith(".");
  };

  const canAddDot = (curDisplay) => {
    const token = getLastToken(curDisplay);
    if (!token) return true;
    if (token === ")" || token === "(") return false;
    if (token.includes(".")) return false;
    return true;
  };

  const handleClick = (value, showValue) => {
    const show = showValue ?? value;
    const evalSym = toEval(show);

    if (show === ".") {
      if (display === "ERROR") {
        setDisplay("0.");
        setExpression("0.");
        return;
      }

      const curDisplay = display;
      const curExpression = expression;
      const lastTrim = lastCharTrim(curDisplay);

      if (lastTrim === ")") {
        setDisplay(curDisplay + " × 0.");
        setExpression(curExpression + "*0.");
        return;
      }

      if (endsWithOperator(curDisplay) || curDisplay.trim() === "" || lastTrim === "(") {
        setDisplay(curDisplay + "0.");
        setExpression(curExpression + "0.");
        return;
      }

      if (!canAddDot(curDisplay)) return;
      setDisplay(curDisplay + ".");
      setExpression(curExpression + ".");
      return;
    }

    if (display === "ERROR") {
      if (operatorsDisplay.includes(show)) return;
      setDisplay(show);
      setExpression(evalSym);
      return;
    }

    const curDisplay = display;
    const curExpression = expression;
    const lastTrim = lastCharTrim(curDisplay);
    const lastIsOp = endsWithOperator(curDisplay);
    const newIsOp = operatorsDisplay.includes(show);

    if (lastTokenEndsWithDot(curDisplay)) {
      if (/\d/.test(show.trim())) {
        setDisplay(curDisplay + show.trim());
        setExpression(curExpression + show.trim());
      }
      return;
    }

    if (show === "(") {
      const lastToken = getLastToken(curDisplay);
      if (lastTrim === "." || lastToken.endsWith(".")) {
        return;
      }
    }

    if (curDisplay === "" && newIsOp && show !== " - ") return;
    if (lastTrim === "(" && newIsOp && show !== " - ") return;

    if (lastIsOp && newIsOp) {
      setDisplay(curDisplay.slice(0, -3) + show);
      setExpression(curExpression.slice(0, -1) + evalSym);
      return;
    }

    if (lastTrim === ")" && (isDigit(show.trim()) || show === "(")) {
      if (show === "(") {
        setDisplay(curDisplay + " × (");
        setExpression(curExpression + "*(");
      } else {
        setDisplay(curDisplay + " × " + show.trim());
        setExpression(curExpression + "*" + evalSym);
      }
      return;
    }

    if ((isDigit(lastTrim) || lastTrim === ")") && show === "(") {
      setDisplay(curDisplay + " × (");
      setExpression(curExpression + "*(");
      return;
    }

    setDisplay(curDisplay + show);
    setExpression(curExpression + evalSym);
  };

  const handleOpenParen = () => {
    if (display === "ERROR") {
      setDisplay("(");
      setExpression("(");
      return;
    }
    const lastTrim = lastCharTrim(display);
    const lastToken = getLastToken(display);

    if (lastTrim === "." || lastToken.endsWith(".")) {
      return;
    }

    if (isDigit(lastTrim) || lastTrim === ")") {
      setDisplay(display + " × (");
      setExpression(expression + "*(");
    } else {
      setDisplay(display + "(");
      setExpression(expression + "(");
    }
  };

  const handleCloseParen = () => {
    if (display === "ERROR") return;
    const openCount = countOpenParens(display);
    const lastTrim = lastCharTrim(display);
    if (openCount > 0 && lastTrim !== "" && !endsWithOperator(display) && lastTrim !== "(") {
      setDisplay(display + ")");
      setExpression(expression + ")");
    }
  };

  const handleBackspace = () => {
    if (display === "ERROR") {
      setDisplay("");
      setExpression("");
      return;
    }

    if (display.endsWith(" ")) {
      setDisplay((prev) => prev.slice(0, -3));
      setExpression((prev) => prev.slice(0, -1));
      return;
    }
    setDisplay((prev) => prev.slice(0, -1));
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setDisplay("");
    setExpression("");
  };

  const calculate = () => {
    if (display === "") return;
    if (display === "ERROR") return;
    if (countOpenParens(display) !== 0) {
      setDisplay("ERROR");
      setExpression("");
      return;
    }
    try {
      const result = eval(expression);
      if (result === Infinity || result === -Infinity || Number.isNaN(result)) {
        setDisplay("ERROR");
        setExpression("");
        return;
      }
      setDisplay(String(result));
      setExpression(String(result));
    } catch {
      setDisplay("ERROR");
      setExpression("");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (lastTokenEndsWithDot(display)) {
        if (/\d/.test(key)) {
          handleClick(key);
        } else if (key === "Backspace") {
          handleBackspace();
        } else if (key === "Enter") {
          calculate();
        } else if (key === "Escape") {
          handleClear();
        }
        return;
      }

      if (/\d/.test(key)) {
        handleClick(key);
      } else if (key === "+") {
        handleClick(" + ");
      } else if (key === "-") {
        handleClick(" - ");
      } else if (key === "*") {
        handleClick("*", " × ");
      } else if (key === "/") {
        handleClick("/", " ÷ ");
      } else if (key === "(") {
        handleOpenParen();
      } else if (key === ")") {
        handleCloseParen();
      } else if (key === "Backspace") {
        handleBackspace();
      } else if (key === "Enter") {
        calculate();
      } else if (key === "Escape") {
        handleClear();
      } else if (key === ".") {
        handleClick(".");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [display, expression]);

  return (
    <>
      <div className="contenedor">
        <p className="cargando">Cargando calculadora...</p>
        <div className="calculadora">
          <div className="contenido">
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
                <button className="cero" onClick={() => handleClick("0")}>0</button>
                <button className="punto" onClick={() => handleClick(".")}>.</button>
              </div>
              <div className="signos">
                <button className="C" onClick={handleClear}>C</button>
                <button className="borrar" onClick={handleBackspace}>⌫</button>
                <button onClick={() => handleClick(" + ")}>+</button>
                <button onClick={() => handleClick(" - ")}>-</button>
                <button onClick={() => handleClick("*", " × ")}>×</button>
                <button onClick={() => handleClick("/", " ÷ ")}>÷</button>
                <button onClick={handleOpenParen}>(</button>
                <button className="parentesis" onClick={handleCloseParen}>)</button>
                <button className="igual" onClick={calculate}>=</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <p>© 2025 Lucas — Desarrollador Frontend</p>
      </footer>
    </>
  );
}

export default App;
