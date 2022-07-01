import React from "react";
import { Link } from "react-router-dom";
import { Label } from "semantic-ui-react";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import bedhost_api_url from "./const/server";
import "bootstrap/dist/css/bootstrap.min.css";

const api = axios.create({
  baseURL: bedhost_api_url,
});

export default class BedCountsSpan extends React.Component {
  constructor() {
    super();
    this.state = {
      bed: -1,
      bedSet: -1,
      sampleBed: "",
      sampleBedSet: "",
      bedAPI: "",
      bedSetAPI: "",
      genomeList: [],
    };
  }

  async componentDidMount() {
    let genomes = await api.get("/api/bed/genomes").then(({ data }) => data);
    this.setState({ genomeList: genomes });

    let bfcount = await api
      .get("/api/bed/count")
      .catch(function (error) {
        alert(error + "; is bedhost running at " + bedhost_api_url + "?");
      });
    // console.log("BED file count retrieved from the server: ", bfcount.data);
    this.setState({ bed: bfcount.data });

    let bscount = await api
      .get("/api/bedset/count")
      .catch(function (error) {
        alert(error + "; is bedhost running at " + bedhost_api_url + "?");
      });
    // console.log("BED set count retrieved from the server: ", bscount.data);
    this.setState({ bedSet: bscount.data });

    let bed = await api.get("/api/bed/all/metadata?ids=md5sum&limit=1").then(({ data }) => data);
    let bedurl = '/bedsplash/' + bed.data[0][0]
    this.setState({ sampleBed: bedurl });

    let bedset = await api.get("/api/bedset/all/metadata?ids=md5sum&limt=1").then(({ data }) => data)
    let bedseturl = '/bedsetsplash/' + bedset.data[0][0]
    this.setState({ sampleBedSet: bedseturl });
    this.getAPIcount()
  }

  async getAPIcount() {
    let api_json = await fetch(bedhost_api_url + "/openapi.json")
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.paths;
      });

    let bed_api = 0;
    let bedset_api = 0;

    Object.entries(api_json).map(([key, value]) => {
      if (key.includes("/api/bed/")) {
        bed_api++;
      } else if (key.includes("/api/bedset/")) {
        bedset_api++;
      }
      return [bed_api, bedset_api];
    });

    this.setState({
      bedAPI: bed_api,
      bedSetAPI: bedset_api,
    });
  }

  render() {
    return (
      <div>
        <h1>Welcome to BEDBASE</h1>
        <span style={{ fontSize: "12pt" }}>
          Here we provide a web interface and a RESTful API to access the
          statistics and plots of BED files and BED sets that produced by the
          bedstat and bedbuncher pipeline.{" "}
        </span>
        <div>
          <Label
            style={{
              marginTop: "15px",
              marginBottom: "5px",
              marginLeft: "15px",
              fontSize: "15px",
              padding: "6px 20px 6px 30px",
            }}
            as="a"
            color="teal"
            ribbon
          >
            Available Servers
          </Label>
          {
            <table style={{ marginLeft: "15px" }}>
              <tbody>
                <tr>
                  <th style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    Server Name
                  </th>
                  <th style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    URL
                  </th>
                  <th style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    Maintainer
                  </th>
                  <th style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    Description
                  </th>
                </tr>
                <tr style={{ verticalAlign: "top" }}>
                  <td
                    style={{
                      padding: "3px 15px",
                      fontSize: "10pt",
                      fontWeight: "bold",
                    }}
                  >
                    Primary server
                  </td>
                  <td style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    <a
                      href={"http://bedbase.org"}
                      className="home-link"
                      style={{ fontSize: "10pt" }}
                    >
                      http://bedbase.org
                    </a>
                  </td>
                  <td style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    Sheffield lab
                  </td>
                  <td style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    Main demonstration server
                  </td>
                </tr>
                <tr style={{ verticalAlign: "top" }}>
                  <td
                    style={{
                      padding: "3px 15px",
                      fontSize: "10pt",
                      fontWeight: "bold",
                    }}
                  >
                    Dev server
                  </td>
                  <td style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    <a
                      href={"http://dev1.bedbase.org"}
                      className="home-link"
                      style={{ fontSize: "10pt" }}
                    >
                      http://dev1.bedbase.org
                    </a>
                  </td>
                  <td style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    Sheffield lab
                  </td>
                  <td style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    Developmental server
                  </td>
                </tr>
              </tbody>
            </table>
          }
          <Label
            style={{
              marginTop: "15px",
              marginBottom: "5px",
              marginLeft: "15px",
              fontSize: "15px",
              padding: "6px 20px 6px 30px",
            }}
            as="a"
            color="teal"
            ribbon
          >
            BEDBASE Status
          </Label>
          {this.state.bedSet !== -1 ? (
            <table style={{ marginLeft: "15px" }}>
              <tbody>
                <tr>
                  <th style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    Table Name
                  </th>
                  <th style={{ padding: "3px 15px", fontSize: "10pt" }}>Size</th>
                  <th style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    Reference Assemblies
                  </th>
                  <th style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    Endpoints Served
                  </th>
                  <th style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    Example
                  </th>
                </tr>
                <tr style={{ verticalAlign: "top" }}>
                  <td
                    style={{
                      padding: "3px 15px",
                      fontSize: "10pt",
                      fontWeight: "bold",
                    }}
                  >
                    BED files
                  </td>
                  <td style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    {this.state.bed}
                  </td>
                  <td style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    {/* {this.state.genomeList.map((value, index) => {
                      return (
                        value.genome.digest ? (
                          <p key={index} >
                            {value.genome.alias}{" "}
                            <a
                              href={"http://refgenomes.databio.org/#" + value.genome.alias}
                              className="home-link"
                              style={{ fontSize: "10pt" }}
                            >
                              [Refgenie]
                            </a>
                          </p>
                        ) : (
                          <p key={index} >
                            {value.genome.alias}{" "}
                          </p>
                        )
                      );
                    })} */}
                    {Array.from(new Set(this.state.genomeList.map(obj => obj.genome.alias))).map((value, index) => {
                      return (
                        <text key={index} >
                          {value}{", "}
                        </text>
                      );
                    })}
                  </td>
                  <td style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    {this.state.bedAPI}
                  </td>
                  <td style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    <Link
                      className="home-link"
                      to={{
                        pathname: this.state.sampleBed,
                      }}
                    >
                      BED splash page
                    </Link>
                  </td>
                </tr>
                <tr style={{ verticalAlign: "top" }}>
                  <td
                    style={{
                      padding: "3px 15px",
                      fontSize: "10pt",
                      fontWeight: "bold",
                    }}
                  >
                    BED sets
                  </td>
                  <td style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    {this.state.bedSet}
                  </td>
                  <td style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    {/* {this.state.genomeList.map((value, index) => {
                      return (
                        value.genome.digest ? (
                          <p key={index} >
                            {value.genome.alias}{" "}
                            <a
                              href={"http://refgenomes.databio.org/#" + value.genome.alias}
                              className="home-link"
                              style={{ fontSize: "10pt" }}
                            >
                              [Refgenie]
                            </a>
                          </p>
                        ) : (
                          <p key={index} >
                            {value.genome.alias}{" "}
                          </p>
                        )
                      );
                    })} */}
                    {Array.from(new Set(this.state.genomeList.map(obj => obj.genome.alias))).map((value, index) => {
                      return (
                        <text key={index} >
                          {value}{", "}
                        </text>
                      );
                    })}
                  </td>
                  <td style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    {this.state.bedSetAPI}
                  </td>
                  <td style={{ padding: "3px 15px", fontSize: "10pt" }}>
                    <Link
                      className="home-link"
                      to={{
                        pathname: this.state.sampleBedSet,
                      }}
                    >
                      BED set splash page
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <>
              <Spinner
                animation="border"
                size="sm"
                style={{ marginBottom: "5px", marginRight: "5px", color: "lightgray" }}
              />
              <span style={{ color: "lightgray" }}>Loading data </span>
            </>
          )}

        </div>
      </div>
    )

  }
}
