import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type OnUpdateFunc = ({
  transcript,
  interimTranscript,
  isFinal,
}: {
  transcript: string;
  interimTranscript: string;
  isFinal: boolean;
}) => void;

export type OnErrorFunc = ({
  error,
}: {
  error: SpeechRecognitionErrorEvent | null;
}) => void;

export interface Options {
  lang?: string;
  continuous?: boolean;
  timeout?: number;
  onUpdate?: OnUpdateFunc;
  onError?: OnErrorFunc;
}

export function useSpeechRecognition({
  lang,
  continuous,
  timeout,
  onUpdate,
  onError,
}: Options) {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isFinal, setIsFinal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<SpeechRecognitionErrorEvent | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const SpeechRecognition = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }, []);

  useEffect(() => {
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    recognitionRef.current = rec;

    rec.lang = lang ?? "en-US";
    rec.continuous = continuous ?? timeout !== undefined;
    rec.interimResults = true;

    rec.onstart = () => {
      setError(null);
      setInterimTranscript("");
      setTranscript("");
      setIsFinal(false);
      setIsListening(true);
    };

    rec.onend = () => {
      setIsFinal(true);
      setIsListening(false);
    };

    rec.onerror = (event) => {
      console.error(`Speech recognition error: ${event.error}`);
      setError(event);
    };

    rec.onresult = (event) => {
      // Handle custom timeout
      if (!continuous && timeout !== undefined) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => rec.stop(), timeout);
      }

      // Parse the transcript from results
      let final = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const s = event.results[i]?.[0]?.transcript.toLocaleLowerCase();
        if (event.results[i]?.isFinal) {
          final += s;
        } else {
          interim += s;
        }
      }
      setInterimTranscript(interim);
      setTranscript(final);
    };

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, [SpeechRecognition, continuous, lang, timeout]);

  useEffect(() => {
    if (!SpeechRecognition) return;
    if (onUpdate) onUpdate({ transcript, interimTranscript, isFinal });
  }, [onUpdate, transcript, interimTranscript, isFinal, SpeechRecognition]);

  useEffect(() => {
    if (!SpeechRecognition) return;
    if (onError) onError({ error });
  }, [onError, error, SpeechRecognition]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.start();
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    isFinal,
    isSupported: !!SpeechRecognition,
    start,
    stop,
    error,
  };
}
