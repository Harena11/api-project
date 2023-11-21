module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      instances: 3, // Nombre d'instances en parallèle
      max_memory_restart: "200M", // Utilisation maximale de la mémoire
      error_file: "./logs/err.log", // Fichier de logs en cas d'erreur
      out_file: "./logs/out.log", // Fichier de logs des sorties
      log_date_format: "YYYY-MM-DD HH:mm:ss", // Format de date pour les logs
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
