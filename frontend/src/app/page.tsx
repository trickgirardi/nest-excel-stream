"use client";

import { useState } from "react";

export default function Home() {
  const [receivedLength, setReceivedLength] = useState(0);

  const handleDownload = async () => {
    try {
      const response = await fetch("http://localhost:3001/excel", {
        method: "GET",
      });

      if (!response.ok || !response.body) {
        throw new Error("Erro ao baixar arquivo");
      }

      // Cria um stream para o arquivo
      const reader = response.body.getReader();
      const chunks = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        setReceivedLength(receivedLength);
      }

      const blob = new Blob(chunks, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "posts.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      alert("Erro ao baixar arquivo");
    } finally {
      setReceivedLength(0);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        className="cursor-pointer bg-white rounded-md px-4 py-2 text-black font-semibold shadow-md hover:bg-gray-200 transition-colors duration-200"
        onClick={handleDownload}
      >
        Gerar Excel
      </button>
      {receivedLength > 0 && (
        <p className="mt-4 text-gray-700">
          Tamanho do arquivo recebido: {receivedLength} bytes
        </p>
      )}
    </div>
  );
}
