import './App.css';
import { Provider } from "react-redux";
import ThemeProvider from "./lib/theme";
import { ToastContainer } from "react-toastify";
import MainRoute from "./routes/MainRoute";

// store
import store from "./store";

// css
import "react-toastify/dist/ReactToastify.css";
import "@reach/combobox/styles.css";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ToastContainer />
        <MainRoute />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
