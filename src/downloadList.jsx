import React from "react";

export default class DownloadList extends React.Component {
  render() {
    return (
      <div>
        {
          Object.entries(this.props.list)
            .map(([key, value],index) =>
              <a href={require(`${"." + value.match(/\/outputs\/.*/)}`)}>
                <li key={index}>{key}</li>
              </a>)
        }
      </div>

    )
  }
}
