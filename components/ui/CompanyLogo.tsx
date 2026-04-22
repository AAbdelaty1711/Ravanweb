"use client";

import { useState } from "react";
import { TICKER_GRADIENTS } from "@/lib/mock-data";

export function CompanyLogo({
  ticker,
  logoUrl,
  size = 40,
}: {
  ticker: string;
  logoUrl: string;
  size?: number;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const grad = TICKER_GRADIENTS[ticker] ?? ["#7C7C7C", "#3C3C3C"];

  return (
    <div
      className="shrink-0 rounded-avatar overflow-hidden border border-white/10 dark:border-white/12"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
      }}
    >
      {!imgFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={ticker}
          width={size}
          height={size}
          className="w-full h-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span
            className="font-outfit font-bold text-white"
            style={{ fontSize: size * 0.38 }}
          >
            {ticker[0]}
          </span>
        </div>
      )}
    </div>
  );
}
