import HtmlWebpackPlugin from 'html-webpack-plugin';

export const entry = './index.js';
export const output = {
  filename: 'index_bundle.js',
};
export const plugins = [new HtmlWebpackPlugin()];

export default {};
