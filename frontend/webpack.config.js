const path = require('path');

module.exports = {
  entry: './src/index.js', // Điểm vào chính của ứng dụng
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Thư mục output
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource', // Hỗ trợ import ảnh
      },
    ],
  },
  mode: 'development', // Hoặc 'production'
};
