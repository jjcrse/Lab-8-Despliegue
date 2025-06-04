// Importaciones necesarias para rutas y el plugin de HTML
import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// Obtiene ruta actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exporta la configuración de Webpack
export default {
  entry: './src/index.ts', // Punto de entrada principal
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Archivos TypeScript
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Permite importar sin extensión
  },
  output: {
    filename: 'bundle.js', // Nombre del JS final
    path: path.resolve(__dirname, 'dist'), // Carpeta de salida
    clean: true, // Limpia dist/ antes de compilar
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Tu plantilla HTML base
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 8086,
  },
  mode: 'production', // Asegura optimización para despliegue
};
