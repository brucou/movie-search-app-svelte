// import "../public/uikit.css";
// import "../public/index.css";
import App from './App.html';
import { createStateMachine } from "state-transducer";
import emitonoff from "emitonoff";
import { commandHandlers, effectHandlers, movieSearchFsmDef } from "./fsm";
import { applyJSONpatch, makeWebComponentFromFsm } from "./helpers";
import { COMMAND_RENDER, events } from "./properties";

let app = void 0;

const fsm = createStateMachine(movieSearchFsmDef, {
  updateState: applyJSONpatch,
  debug: { console }
});

function subjectFromEventEmitterFactory() {
  const eventEmitter = emitonoff();
  const DUMMY_NAME_SPACE = "_";
  const _ = DUMMY_NAME_SPACE;
  const subscribers = [];

  return {
    next: x => eventEmitter.emit(_, x),
    complete: () => subscribers.forEach(f => eventEmitter.off(_, f)),
    subscribe: f => (subscribers.push(f), eventEmitter.on(_, f))
  };
}

const svelteRenderCommandHandler = {
  [COMMAND_RENDER]: (next, params, effectHandlers, el) => {
    const { screen, query, results, title, details, cast  } = params;
    const props = Object.assign({}, params, {next})

    if (!app) {
      app = new App({
        target: el,
        data: props
      });
    }
    else {
      app.set(props);
    }
  }
};
const commandHandlersWithRender = Object.assign({}, commandHandlers, svelteRenderCommandHandler);

const options = { initialEvent: { [events.USER_NAVIGATED_TO_APP]: void 0 } };

makeWebComponentFromFsm({
  name: "movie-search",
  eventSubjectFactory: subjectFromEventEmitterFactory,
  fsm,
  commandHandlers: commandHandlersWithRender,
  effectHandlers,
  options
});

const movieSearch = document.createElement("movie-search");
document.getElementById("root").appendChild(movieSearch);
