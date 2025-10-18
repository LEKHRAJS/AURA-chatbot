import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';

// --- STYLES ---
// This component injects all necessary CSS into the document's head.
const GlobalStyles = () => {
  const styles = `
    /* --- Google Font Import --- */
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

    /* --- Base & Fonts --- */
    body {
        font-family: 'Roboto', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow: hidden; /* Prevent body scroll */
        color: #E5E7EB; /* text-gray-200 */
        margin: 0;
    }

    /* --- Aurora Background & Animations --- */
    .aurora-background {
        background-color: #0a0a0a;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100vh;
    }

    .aurora-background::before,
    .aurora-background::after {
        content: '';
        position: absolute;
        width: 800px;
        height: 800px;
        background-image: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0) 60%);
        border-radius: 50%;
        animation: aurora-glow 15s infinite alternate;
        pointer-events: none;
        z-index: 0;
    }

    .aurora-background::before { top: -30%; left: -30%; }
    .aurora-background::after {
        bottom: -30%; right: -30%;
        animation-delay: -7.5s;
        background-image: radial-gradient(circle, rgba(74, 222, 128, 0.3) 0%, rgba(74, 222, 128, 0) 60%);
    }

    @keyframes aurora-glow {
        0% { transform: scale(0.8) translate(0px, 0px); opacity: 0.6; }
        100% { transform: scale(1.2) translate(40px, -40px); opacity: 0.8; }
    }
    @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
    
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner { animation: spin 1s linear infinite; width: 2rem; height: 2rem; }

    @keyframes bob { 50% { transform: translateY(-4px); background-color: #B6B6B9; } }
    .typing-indicator span {
        height: 8px; width: 8px; float: left; margin: 0 1px;
        background-color: #9E9EA1; display: block; border-radius: 50%;
        opacity: 0.4; animation: bob 1s infinite;
    }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

    /* --- General Layout & Components --- */
    .app-container {
        position: relative;
        z-index: 10;
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center; /* Vertically center content */
        overflow-y: auto;
        padding: 1rem;
        box-sizing: border-box;
    }

    .glassmorphism {
        background: rgba(16, 16, 16, 0.6);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Custom Scrollbars */
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }

    /* --- Login Page --- */
    .login-page { width: 100%; max-width: 24rem; }
    .login-card {
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    .login-header { display: flex; justify-content: center; align-items: center; gap: 0.75rem; }
    .login-header h1 { font-size: 1.875rem; font-weight: 700; color: #FFF; margin:0; }
    .login-card p { color: #9CA3AF; margin:0; }
    .login-input {
        width: 100%;
        box-sizing: border-box;
        padding: 0.75rem 1rem;
        background-color: rgba(17, 24, 39, 0.5);
        border: 1px solid #4B5563;
        border-radius: 0.5rem;
        color: #FFF;
        transition: all 0.3s;
    }
    .login-input::placeholder { color: #6B7280; }
    .login-input:focus { outline: none; box-shadow: 0 0 0 2px #A855F7; }
    
    .primary-button {
        width: 100%;
        background-color: #9333EA;
        color: #FFF;
        font-weight: 600;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transform: scale(1);
        transition: all 0.3s;
        cursor: pointer;
    }
    .primary-button:hover { background-color: #7E22CE; transform: scale(1.05); }
    .primary-button:disabled { background-color: #581C87; cursor: not-allowed; transform: scale(1); }

    /* --- Start Page --- */
    .start-page { width: 100%; max-width: 56rem; text-align: center; }
    .start-card { padding: 2rem; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
    @media (min-width: 768px) { .start-card { padding: 3rem; } }
    .start-card h1 { font-size: 2.25rem; font-weight: 700; color: #FFF; margin-bottom: 1rem; margin-top: 0; }
    @media (min-width: 768px) { .start-card h1 { font-size: 3rem; } }
    .start-card > p { color: #D1D5DB; font-size: 1.125rem; margin-top:0; margin-bottom: 2.5rem; }
    
    .features-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        text-align: left;
        margin-bottom: 2.5rem;
    }
    @media (min-width: 640px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .features-grid { grid-template-columns: repeat(3, 1fr); } }

    .feature-card {
        background-color: rgba(17, 24, 39, 0.4);
        padding: 1.5rem;
        border-radius: 0.75rem;
        border: 1px solid rgba(55, 65, 81, 0.5);
        transition: all 0.3s;
    }
    .feature-card:hover { background-color: rgba(31, 41, 55, 0.6);transform: translateY(-5px); }
    .feature-card h3 { font-weight: 600; font-size: 1.125rem; color: #FFF; margin-top: 0; margin-bottom: 0.5rem; }
    .feature-card p { color: #9CA3AF; font-size: 0.875rem; margin: 0; }
    .feature-card.border-purple:hover { border-color: #A855F7; }
    .feature-card.border-green:hover { border-color: #22C55E; }
    .feature-card.border-blue:hover { border-color: #3B82F6; }
    .feature-card.border-yellow:hover { border-color: #EAB308; }
    .feature-card.border-red:hover { border-color: #EF4444; }
    .feature-card.border-indigo:hover { border-color: #6366F1; }

    .start-page-buttons { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1rem; }
    @media (min-width: 640px) { .start-page-buttons { flex-direction: row; } }
    .start-page-buttons button { width: 100%; }
    @media (min-width: 640px) { .start-page-buttons button { width: auto; padding-left: 2rem; padding-right: 2rem;} }
    
    .green-button { background: #007bff;
  color: white;
  box-shadow: 
    0 4px 15px rgba(0, 123, 255, 0.3),
    0 0 20px rgba(0, 123, 255, 0.1); /* Added glow */ }
    .green-button:hover { background-color: #17055eff; }
    .purple-button { background-color: #9333EA; }
    .purple-button:hover { background-color: #7E22CE; }

    .logout-button {
        background: none;
        border: none;
        color: #9CA3AF;
        cursor: pointer;
        margin-top: 1.5rem;
        font-size: 0.875rem;
        transition: color 0.2s;
    }

    .logout-button:hover {
        color: #FFF;
        text-decoration: underline;
    }

    /* --- Chat Layout --- */
    .chat-layout { display: flex; width: 100%; height: 100vh; position: fixed; top: 0; left: 0; }
    
    /* --- Sidebar --- */
    .sidebar {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        transition: width 0.3s ease-in-out;
        width: 4rem;
        flex-shrink: 0;
    }
    .sidebar.open { width: 16rem; }
    .sidebar-header { flex-shrink: 0; padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .sidebar-button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: 0.375rem;
        color: #FFF;
        transition: background-color 0.2s;
        border: none;
        cursor: pointer;
    }
    .sidebar-button span { text-overflow: ellipsis; white-space: nowrap; overflow: hidden; }
    .sidebar-button-back { background-color: #4B5563; }
    .sidebar-button-back:hover { background-color: #6B7280; }
    .sidebar-button-new { background-color: #9333EA; }
    .sidebar-button-new:hover { background-color: #7E22CE; }
    
    .sidebar-nav { flex-grow: 1; padding: 0.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.25rem; }
    .chat-item-container { display: flex; align-items: center; width: 100%; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; transition: background-color 0.2s; }
    .chat-item-container.active { background-color: rgba(55, 65, 81, 0.8); color: #FFF; }
    .chat-item-container:not(.active) { color: #9CA3AF; }
    .chat-item-container:not(.active):hover { background-color: rgba(31, 41, 55, 0.6); color: #FFF; }
    .chat-item-button { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; flex-grow: 1; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; border: none; background: transparent; color: inherit; cursor: pointer; text-align: left; }
    .chat-item-button span { text-overflow: ellipsis; white-space: nowrap; overflow: hidden; }
    .delete-chat-button { padding: 0.5rem; margin-right: 0.25rem; border-radius: 0.375rem; color: #6B7280; opacity: 0; transition: opacity 0.2s; border: none; background: transparent; cursor: pointer; }
    .chat-item-container:hover .delete-chat-button { opacity: 1; }
    .delete-chat-button:hover { background-color: rgba(239, 68, 68, 0.2); color: #F87171; }

    /* --- Chat Interface --- */
    .chat-interface { display: flex; flex-direction: column; flex-grow: 1; height: 100%; background-color: rgba(0, 0, 0, 0.1); }
    .chat-main { flex-grow: 1; padding: 1.5rem; overflow-y: auto; }
    .chat-messages-container { max-width: 56rem; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
    .chat-footer { flex-shrink: 0; padding: 1rem; background-color: transparent; }
    .chat-input-container { max-width: 56rem; margin: 0 auto; }
    .chat-input-wrapper {
        display: flex;
        align-items: center;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
    }
    .chat-input-wrapper:focus-within { box-shadow: 0 0 0 2px #A855F7; }
    .chat-input {
        width: 100%;
        background-color: transparent;
        color: #FFF;
        outline: none;
        border: none;
        font-size: 1rem;
        resize: none;
        line-height: 1.5;
    }
    .chat-input::placeholder { color: #6B7280; }
    .chat-action-button { margin-left: 0.5rem; padding: 0.5rem; border-radius: 50%; transition: background-color 0.2s; border: none; background: transparent; cursor: pointer; }
    .chat-action-button:hover { background-color: #4B5563; }
    .chat-action-button:disabled { opacity: 0.5; cursor: not-allowed; }
    
    @keyframes pulse { 50% { transform: scale(1.2); } }
    .voice-button.listening svg { color: #EF4444 !important; animation: pulse 1s infinite; }

    /* --- File Preview --- */
    .file-preview-container {
      position: relative;
      margin-bottom: 0.5rem;
      width: fit-content;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      border: 1px solid #4B5563;
      color: #E5E7EB;
    }
    .file-preview-container span {
        font-size: 0.875rem;
        font-family: monospace;
    }
    .remove-file-button {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #1F2937;
      border: 1px solid #4B5563;
      color: #E5E7EB;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      line-height: 1;
    }

    /* --- Messages --- */
    .message-bubble { display: flex; align-items: flex-end; gap: 0.75rem; }
    .message-bubble.user { flex-direction: row-reverse; }
    .avatar {
        width: 2rem; height: 2rem;
        border-radius: 9999px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        background-color: #A855F7;
    }
    .message-content { padding: 1rem; border-radius: 1rem; max-width: 80%; }
    .message-content.bot { background-color: #1F2937; border-bottom-left-radius: 0; }
    .message-content.user { background-color: #210590ff; color: #FFF; border-bottom-right-radius: 0; }
    
    /* --- Prose / Markdown Styles --- */
    .prose {
        line-height: 1.6;
    }
    .prose p, .prose ul, .prose ol { margin-top: 0; margin-bottom: 1rem; }
    .prose h1, .prose h2, .prose h3, .prose h4 { margin: 1.5rem 0 0.5rem 0; font-weight: 600; }
    .prose ul, .prose ol { padding-left: 1.5rem; }
    .prose li { margin-bottom: 0.25rem; }
    .prose a { color: #60A5FA; text-decoration: underline; }
    .prose strong { font-weight: 700; }
    .prose pre {
        white-space: pre-wrap; word-wrap: break-word; background-color: #1a1a1a;
        color: #f0f0f0; padding: 1rem; border-radius: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.1); overflow-x: auto;
    }
    .prose code { font-family: 'Courier New', Courier, monospace; background-color: #374151; padding: 0.1rem 0.3rem; border-radius: 0.25rem; }
    .prose pre code { background-color: transparent; padding: 0; }
    .prose-invert { color: #D1D5DB; }
    .prose-invert a { color: #93C5FD; }
    .prose-invert strong { color: #FFF; }

    .empty-chat-view {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        height: 100%; text-align: center; padding: 1rem;
    }
    .empty-chat-view div { max-width: 42rem; }
    .empty-chat-view h1 { font-size: 1.875rem; font-weight: 700; color: #FFF; margin-top: 1rem; }
    .empty-chat-view p { color: #9CA3AF; margin-top: 0.5rem; }

    /* --- Modal --- */
    .modal-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 50; }
    .modal-content {
        border-radius: 1rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        width: 100%;
        max-width: 42rem;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
    }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid rgba(55, 65, 81, 0.5); }
    .modal-header h2 { font-size: 1.25rem; font-weight: 600; color: #FFF; margin: 0; }
    .modal-header button { color: #9CA3AF; border: none; background: transparent; font-size: 1.5rem; cursor: pointer; }
    .modal-header button:hover { color: #FFF; }
    .modal-body { padding: 1.5rem; overflow-y: auto; }
    .modal-body-loading { display: flex; justify-content: center; align-items: center; height: 12rem; }
  `;
  return <style>{styles}</style>;
};

// --- API & CONFIG ---
// IMPORTANT: You must replace "YOUR_API_KEY_HERE" with your own Google AI Gemini API key.
// Get one from Google AI Studio: https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = "AIzaSyBxxLAIqSAHxxMz4h6PbLsAEq7cyYpxKWs";

// --- API HELPER ---
const fileToText = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});

const callGeminiAPI = async (prompt, file = null, expectJson = false) => {
    if (GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
        throw new Error("Please replace 'YOUR_API_KEY_HERE' with your actual Gemini API key.");
    }
    const model = 'gemini-2.5-flash-preview-05-20';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    
    let finalPrompt = prompt;

    if (file) {
        const fileContent = await fileToText(file);
        // Construct a new prompt that includes the file content
        finalPrompt = `Analyze the following text content from the file named "${file.name}" and respond to my request.\n\nREQUEST: "${prompt}"\n\n--- FILE CONTENT ---\n${fileContent}`;
    }

    let payload = { contents: [{ parts: [{ text: finalPrompt }] }], tools: [{ "google_search": {} }] };

    if (expectJson) {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: { type: "ARRAY", items: { type: "STRING" } }
        };
    }

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("Gemini API Error:", errorBody);
        throw new Error(errorBody.error?.message || 'Gemini API request failed.');
    }

    const result = await response.json();
    const botResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (typeof botResponse === 'string') {
        return botResponse;
    } else {
        console.error("Invalid response structure:", result);
        throw new Error("Received an invalid or empty response from the AI.");
    }
};


// --- ICONS ---
const AuraIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#A855F7' }}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>);
const SendIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9CA3AF' }}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>);
const SpinnerIcon = () => (<svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const MessageIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);
const BackIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>);
const MicrophoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#9CA3AF'}}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>;
const PaperclipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#9CA3AF'}}><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9CA3AF' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;

// --- MODAL COMPONENT ---
function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay animate-fade-in" onClick={onClose}>
            <div className="modal-content glassmorphism" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body custom-scrollbar">{children}</div>
            </div>
        </div>
    );
}

// --- LOGIN PAGE COMPONENT ---
function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const handleLogin = () => { if (username.trim()) { onLogin(username); } };
    return (
        <div className="login-page">
            <div className="login-card glassmorphism animate-fade-in">
                <div className="login-header"><AuraIcon /><h1>Aura</h1></div>
                <p>Your Personal Support Bot. Sign in to continue.</p>
                <div>
                    <input id="username-input" type="text" placeholder="Enter your name" value={username} onChange={(e) => setUsername(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} className="login-input" />
                </div>
                <button onClick={handleLogin} className="primary-button" disabled={!username.trim()}> Enter Aura </button>
            </div>
        </div>
    );
}

// --- START PAGE COMPONENT ---
function StartPage({ username, onNavigateToChat, onLogout }) {
    const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
    const [briefingContent, setBriefingContent] = useState("");
    const [isBriefingLoading, setIsBriefingLoading] = useState(false);

    const getDailyBriefing = async () => {
        setIsBriefingLoading(true);
        setBriefingContent("");
        setIsBriefingModalOpen(true);
        try {
            const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
            const prompt = `It is currently ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} in Mumbai, India. Generate a personalized daily briefing for a user named ${username}. Include:
            1. A short, powerful motivational quote.
            2. A fascinating 'Today in History' fact for this date.
            3. A brief weather forecast for Mumbai today (e.g., sunny, cloudy, chance of rain, expected temperature range).
            4. A brief, positive outlook for the day ahead.
            Format the entire response using Markdown with clear headings for each section (e.g., ### Quote of the Day).`;
            const briefing = await callGeminiAPI(prompt);
            setBriefingContent(briefing);
        } catch (error) {
            console.error("Briefing Error:", error);
            setBriefingContent("Sorry, I couldn't generate your briefing right now. Please try again later.");
        } finally {
            setIsBriefingLoading(false);
        }
    };

    const features = [
        { title: "Instant Answers", description: "Get quick answers to your questions...", borderColor: "border-purple" },
        { title: "Creative Partner", description: "Brainstorm ideas, write poems...", borderColor: "border-green" },
        { title: "Code Assistant", description: "Write, debug, and explain code...", borderColor: "border-blue" },
        { title: "Text File Analysis", description: "Upload a text file for analysis...", borderColor: "border-yellow" },
        { title: "Summarize & Translate", description: "Condense long articles or translate text...", borderColor: "border-red" },
        { title: "Personal Support", description: "A friendly ear to listen, offer advice...", borderColor: "border-indigo" },
    ];

    const BriefingDisplay = () => {
        const htmlContent = marked.parse(briefingContent);
        return <div className="prose prose-invert" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    };

    return (
        <>
            <Modal isOpen={isBriefingModalOpen} onClose={() => setIsBriefingModalOpen(false)} title="Your Daily Briefing">
                {isBriefingLoading ? <div className="modal-body-loading"><SpinnerIcon /></div> : <BriefingDisplay />}
            </Modal>
            <div className="start-page animate-fade-in">
                <div className="start-card glassmorphism">
                    <h1>Welcome, {username}!</h1>
                    <p>I'm Aura, your personal AI assistant. How can I support you today?</p>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className={`feature-card ${feature.borderColor}`}>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="start-page-buttons">
                        <button onClick={onNavigateToChat} className="primary-button green-button">Go to Chats</button>
                        <button onClick={getDailyBriefing} className="primary-button purple-button">✨ Get My Daily Briefing</button>
                    </div>
                    <button onClick={onLogout} className="logout-button">Not {username}? Log out</button>
                </div>
            </div>
        </>
    );
}


// --- SIDEBAR COMPONENT ---
function Sidebar({ chats, activeChatId, onNewChat, onSelectChat, onDeleteChat, isSidebarOpen, setIsSidebarOpen, onBackToStart }) {
    return (
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} onMouseEnter={() => setIsSidebarOpen(true)} onMouseLeave={() => setIsSidebarOpen(false)}>
            <div className="sidebar-header">
                <button onClick={onBackToStart} className="sidebar-button sidebar-button-back">
                    <BackIcon />
                    {isSidebarOpen && <span>Back to Start</span>}
                </button>
                <button onClick={onNewChat} className="sidebar-button sidebar-button-new">
                    <PlusIcon />
                    {isSidebarOpen && <span>New Chat</span>}
                </button>
            </div>
            <nav className="sidebar-nav custom-scrollbar">
                {chats.map(chat => (
                    <div key={chat.id} className={`chat-item-container ${activeChatId === chat.id ? 'active' : ''}`}>
                        <button onClick={() => onSelectChat(chat.id)} className="chat-item-button">
                            <MessageIcon />
                            {isSidebarOpen && <span>{chat.title}</span>}
                        </button>
                        {isSidebarOpen && (
                            <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }} className="delete-chat-button">
                                <TrashIcon />
                            </button>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
}

// --- CHAT INTERFACE COMPONENT ---
function ChatInterface({ chat, onSendMessage, username }) {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [attachedFile, setAttachedFile] = useState(null);
    const [isListening, setIsListening] = useState(false);
    
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const recognitionRef = useRef(null);
    const textareaRef = useRef(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat?.messages, isLoading]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => console.error('Speech recognition error:', event.error);

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            setInput(prev => prev + finalTranscript);
        };
        
        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const handleSend = async () => {
        const messageText = input;
        if ((!messageText.trim() && !attachedFile) || isLoading) return;
        
        setInput('');
        const fileToSend = attachedFile;
        setAttachedFile(null);
        setIsLoading(true);
        
        try { 
            await onSendMessage(messageText, fileToSend); 
        } catch (error) { 
            console.error("Sending message failed:", error); 
        } finally { 
            setIsLoading(false); 
        }
    };

    const handleVoiceInput = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAttachedFile(file);
        }
    };
    
    const renderMessage = (msg, index) => {
        const isBot = msg.from === 'bot';
        const htmlContent = marked.parse(msg.text);
        return (
            <div key={index} className={`message-bubble ${isBot ? 'bot' : 'user'}`}>
                <div className="avatar" style={!isBot ? {backgroundColor: '#16A34A'} : {}}>{isBot ? 'A' : username.charAt(0).toUpperCase()}</div>
                <div className={`message-content prose prose-invert ${isBot ? 'bot' : 'user'}`} dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
        );
    };

    const EmptyChatView = () => (
        <div className="empty-chat-view">
            <div>
                <AuraIcon />
                <h1>Aura Chat</h1>
                <p><strong>A question you've been pondering?</strong> No matter how big or small.</p>
            </div>
        </div>
    );

    return (
        <div className="chat-interface">
            <main className="chat-main custom-scrollbar">
                <div className="chat-messages-container">
                    {chat && chat.messages.length > 0 ? chat.messages.map(renderMessage) : <EmptyChatView />}
                    {isLoading && (
                        <div className="message-bubble bot">
                            <div className="avatar">A</div>
                            <div className="message-content bot"><div className="typing-indicator"><span></span><span></span><span></span></div></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <footer className="chat-footer">
                <div className="chat-input-container">
                    {attachedFile && (
                        <div className="file-preview-container">
                            <FileTextIcon />
                            <span>{attachedFile.name}</span>
                            <button onClick={() => setAttachedFile(null)} className="remove-file-button">&times;</button>
                        </div>
                    )}
                    <div className="chat-input-wrapper glassmorphism">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".txt,.md,.csv,.json,.js,.css,.html" />
                        
                        <button onClick={() => fileInputRef.current.click()} disabled={isLoading} className="chat-action-button">
                           <PaperclipIcon />
                        </button>

                        <textarea
                            ref={textareaRef}
                            value={input} 
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Ask Aura anything, or attach a text file..."
                            className="chat-input custom-scrollbar"
                            rows={1}
                            disabled={isLoading}
                        />

                        <button onClick={handleVoiceInput} disabled={isLoading} className={`chat-action-button voice-button ${isListening ? 'listening' : ''}`}>
                            <MicrophoneIcon />
                        </button>
                        
                        <button onClick={handleSend} disabled={isLoading || (!input.trim() && !attachedFile)} className="chat-action-button">
                            <SendIcon />
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// --- MAIN APP COMPONENT ---
export default function App() {
    const [page, setPage] = useState('login'); // 'login', 'start', 'chat'
    const [username, setUsername] = useState('');
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        try {
            const savedUsername = localStorage.getItem('aura-username');
            if (savedUsername) {
                setUsername(savedUsername);
                setPage('start');
            }
            const savedChats = JSON.parse(localStorage.getItem('aura-chats'));
            if (savedChats && savedChats.length > 0) {
                setChats(savedChats);
                setActiveChatId(savedChats[0].id);
            }
        } catch (error) { console.error("Failed to load data from localStorage", error); }
    }, []);

    useEffect(() => {
        try {
            if (chats.length > 0) {
                 localStorage.setItem('aura-chats', JSON.stringify(chats));
            } else {
                 localStorage.removeItem('aura-chats');
            }
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    }, [chats]);
    
    const handleLogin = (name) => {
        setUsername(name);
        localStorage.setItem('aura-username', name);
        setPage('start');
    };

    const handleLogout = () => {
        localStorage.removeItem('aura-username');
        localStorage.removeItem('aura-chats');
        setUsername('');
        setChats([]);
        setActiveChatId(null);
        setPage('login');
    };

    const prepareNewChat = () => {
        setActiveChatId(null);
        setPage('chat');
    };
    
    const handleSelectChat = (id) => {
        setActiveChatId(id);
    };

    const handleDeleteChat = (idToDelete) => {
        setChats(prev => {
            const newChats = prev.filter(chat => chat.id !== idToDelete);
            if (activeChatId === idToDelete) {
                setActiveChatId(newChats.length > 0 ? newChats[0].id : null);
            }
            return newChats;
        });
    };

    const handleSendMessage = async (messageText, file = null) => {
        const userMessage = { from: 'user', text: messageText };
        
        let currentChatId = activeChatId;
        let isFirstMessage = false;

        if (currentChatId === null) {
            const titleText = messageText || (file ? `Analysis of ${file.name}` : "New Chat");
            const newChat = { 
                id: Date.now(), 
                title: titleText.substring(0, 30) + (titleText.length > 30 ? '...' : ''),
                messages: [userMessage] 
            };
            currentChatId = newChat.id;
            isFirstMessage = true;
            
            setChats(prev => [newChat, ...prev]);
            setActiveChatId(newChat.id);
        } else {
            setChats(prev => prev.map(chat => {
                if (chat.id === currentChatId) {
                    isFirstMessage = chat.messages.length === 0;
                    return { ...chat, messages: [...chat.messages, userMessage] };
                }
                return chat;
            }));
        }

        if (isFirstMessage && messageText) {
            try {
                const titlePrompt = `Summarize the following into a short title (max 4 words): "${messageText}"`;
                const newTitle = await callGeminiAPI(titlePrompt);
                setChats(prev => prev.map(chat => 
                    chat.id === currentChatId ? { ...chat, title: newTitle.replace(/"/g, '') } : chat
                ));
            } catch (error) { 
                console.error("Failed to generate title:", error); 
            }
        }

        try {
            const botResponseText = await callGeminiAPI(messageText, file);
            const botMessage = { from: 'bot', text: botResponseText };
            setChats(prev => prev.map(chat => 
                chat.id === currentChatId ? { ...chat, messages: [...chat.messages, botMessage] } : chat
            ));
        } catch (error) {
            console.error("API Error:", error);
            const errorMessage = { from: 'bot', text: `Sorry, I encountered an error. **Error:** ${error.message}` };
            setChats(prev => prev.map(chat => 
                chat.id === currentChatId ? { ...chat, messages: [...chat.messages, errorMessage] } : chat
            ));
        }
    };

    const activeChat = chats.find(chat => chat.id === activeChatId);

    const renderPage = () => {
        switch(page) {
            case 'start':
                return <StartPage username={username} onNavigateToChat={() => setPage('chat')} onLogout={handleLogout} />;
            case 'chat':
                return (
                    <div className="chat-layout">
                        <Sidebar 
                            chats={chats} activeChatId={activeChatId}
                            onNewChat={prepareNewChat} 
                            onSelectChat={(id) => {
                                handleSelectChat(id);
                                setPage('chat');
                            }}
                            onDeleteChat={handleDeleteChat} isSidebarOpen={isSidebarOpen}
                            setIsSidebarOpen={setIsSidebarOpen} onBackToStart={() => setPage('start')}
                        />
                        <ChatInterface 
                            key={activeChatId} chat={activeChat}
                            onSendMessage={handleSendMessage}
                            username={username}
                        />
                    </div>
                );
            case 'login':
            default:
                return <LoginPage onLogin={handleLogin} />;
        }
    };

    return (
        <>
            <GlobalStyles />
            <div className="aurora-background">
                <div className={page !== 'chat' ? "app-container" : ""}>
                   {renderPage()}
                </div>
            </div>
        </>
    );
}

