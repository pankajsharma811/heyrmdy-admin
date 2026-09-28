type LogLevel = "info" | "warn" | "error" | "debug";

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      ...(process.env.NODE_ENV == "development" ? { stack: error.stack } : {}),
    };
  }
  return error;
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>){
    const formattedMeta = meta ? {...meta, ...(meta.error ? { error: serializeError(meta.error)}: {})} : undefined;
    const entry = {level, message, timestamp: new Date().toISOString(),...(formattedMeta? {meta: formattedMeta}:{})}
    
    const line = JSON.stringify(entry,(_key, value)=>
     typeof value === "bigint" ? value.toString(): value
    );

    switch(level){
        case "error":
            console.error(line);
            break;
            
        case "warn":
            console.warn(line);
            break;
        
        default:
            console.log(line)
    }
}

export const logger = {
    info: (message: string, meta?: Record<string, unknown>) => {
        log("info", message, meta);
    },

    warn: (message: string, meta?: Record<string, unknown>) => {
        log("warn", message, meta);
    },

    error: (message: string, meta?: Record<string, unknown>) => {
        log("error", message, meta);
    },

    debug: (message: string, meta?: Record<string, unknown>) => {
        if(process.env.NODE_ENV === "development"){
            log("debug", message, meta);
        }
    }
}