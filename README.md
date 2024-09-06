# @intentface/react-speech-recognition

`@intentface/react-speech-recognition` is a custom React hook that provides an easy-to-use interface for integrating speech recognition capabilities into your React applications. It leverages the native browser `SpeechRecognition` API, allowing you to capture and process voice inputs with customizable options.

## Installation

You can install this package via npm:

```bash
npm install @intentface/react-speech-recognition
```

## Usage

Here’s a basic example of how to use the `useSpeechRecognition` hook in your React project:

```tsx
import React from "react";
import { useSpeechRecognition } from "@intentface/react-speech-recognition";

const SpeechComponent = () => {
  const {
    transcript,
    interimTranscript,
    isListening,
    isFinal,
    isSupported,
    start,
    stop,
    error,
  } = useSpeechRecognition({
    lang: "en-US", // Language for speech recognition (default is "en-US")
    continuous: false, // Whether to keep listening or stop after receiving input
    timeout: 5000, // Automatically stop listening after 5 seconds
    onUpdate: ({ transcript, interimTranscript, isFinal }) => {
      console.log("Update:", { transcript, interimTranscript, isFinal });
    },
    onError: ({ error }) => {
      console.error("Speech recognition error:", error);
    },
  });

  if (!isSupported) {
    return <p>Your browser does not support Speech Recognition.</p>;
  }

  return (
    <div>
      <h1>Speech Recognition Example</h1>
      <p>Transcript: {transcript}</p>
      <p>Interim Transcript: {interimTranscript}</p>
      <p>
        Status:{" "}
        {isListening ? "Listening..." : isFinal ? "Finalized" : "Stopped"}
      </p>
      {error && <p>Error: {error.message}</p>}
      <button onClick={start}>Start Listening</button>
      <button onClick={stop}>Stop Listening</button>
    </div>
  );
};

export default SpeechComponent;
```

### API

The `useSpeechRecognition` hook returns an object containing the following properties:

#### Returned Values

- `transcript`: The final processed transcript of the recognized speech.
- `interimTranscript`: The current intermediate transcript while speech is being processed.
- `isListening`: A boolean indicating whether the recognition is currently active.
- `isFinal`: A boolean indicating whether the current session has ended and the transcript is finalized.
- `isSupported`: A boolean indicating whether the browser supports speech recognition.
- `start()`: A function to start speech recognition.
- `stop()`: A function to stop speech recognition.
- `error`: An object containing any speech recognition errors that occurred.

#### Options

The hook accepts an options object with the following fields:

- `lang`: The language for speech recognition (default is `"en-US"`).
- `continuous`: If `true`, the recognition will continue until stopped manually (default: `false`).
- `timeout`: Time in milliseconds to automatically stop recognition after no speech is detected (default: `undefined`). If left _undefined_, browsers default behaviour is respected.
- `onUpdate`: A callback function triggered when there is an update in the transcript. Receives an object with `{ transcript, interimTranscript, isFinal }`.
- `onError`: A callback function triggered when an error occurs. Receives an object with `{ error }`.

### Features

- **Customizable Language**: Set the language of recognition with the `lang` option.
- **Continuous Listening**: Option to listen continuously for speech input.
- **Timeout Control**: Automatically stop recognition after a set period of inactivity.
- **Error Handling**: Receive error information via the `onError` callback.
- **Interim and Final Transcripts**: Access both the interim (in-progress) and final transcripts.

### Browser Compatibility

This hook uses the native `SpeechRecognition` API (also known as `webkitSpeechRecognition` in some browsers). Below is a list of supported browsers:

| Browser | Supported Versions |
| ------- | ------------------ |
| Chrome  | Version 33+        |
| Safari  | Version 14+        |
| Edge    | Version 79+        |

> Note: The `SpeechRecognition` API is not supported in Firefox or Internet Explorer. Please check for browser compatibility using the `isSupported` flag provided by the hook.

### Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, feel free to create a pull request or file an issue in the repository.

Please remember to add the changes you are making by running

```bash
npm run add-change
```

### License

MIT

## Dev

### Doing a release

After finishing your feature normally, to automatically bump version number, update changelog and do an npm release:

1.  `npm run add-change`
2.  Follow the instructions
3.  Commit the changeset file(s) to your feature branch and push to Github
4.  Create a PR normally, including the changeset file(s)
5.  Eventually accept the PR called "Version Packages" created by the changeset bot

## About us

For more details about who we are, visit our website: [Intentface](https://www.intentface.com/).
