import * as React from "react";
import { Component } from 'react';
import * as sudoku from '../sudoku';

export default class Sudoku extends Component<any, sudoku.sudoku> {

  constructor(props: any) {
    super(props);
    this.state = null;
  }

  async componentDidMount() {
    const response = await fetch('https://s5w.uk/sudoku-api');
    const responseData: number[] =  await response.json(); // [1, 2, 3, 4]

    this.setState(sudoku.transpose(responseData));
  }

  render() {
    const rows  = this.state && this.state.values || [];

    return (
      <table><tbody>{
        rows.map(row => <tr>{
                row.map(cell => <td>{
                    cell
                }</td>)
            }</tr>
        )}</tbody></table>
    );
  }

}
