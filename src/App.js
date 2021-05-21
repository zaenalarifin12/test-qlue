import React, { useState, useEffect, useMemo } from "react";

import "./assets/style.scss";
import "./assets/dashboard.css";
import axios from "axios";

import MyResponsiveBar from "./components/MyResponsiveBar";
import Skeleton from "react-loading-skeleton";

function App() {
  const api = `https://swapi.dev/api/people/`;

  const [display, setDisplay] = useState("table");
  const [page, setPage] = useState(1);
  const [peoples, setPeoples] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDataFromApi = async (url, page) => {
    setIsLoading(true);

    // cek di localstorage
    const peoplesFromLocalStorage = localStorage.getItem(`peoples-${page}`);

    if (peoplesFromLocalStorage != null) {
      setPeoples({
        data: JSON.parse(peoplesFromLocalStorage),
      });

      updateDataChart(JSON.parse(peoplesFromLocalStorage));

      setIsLoading(false);
    } else {
      try {
        await axios.get(`${url}`, { params: { page: page } }).then((res) => {
          setPeoples({
            data: res.data,
          });

          localStorage.setItem(`peoples-${page}`, JSON.stringify(res.data));

          updateDataChart(res.data);

          setIsLoading(false);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const [data, setData] = useState([]);

  const updateDataChart = (res) => {
    setData(
      res.results.map((p) => {
        return {
          name: p.name,
          mass: parseInt(p.mass) || 0,
          height: parseInt(p.height) || 0,
        };
      })
    );
  };
  useEffect(() => {
    getDataFromApi(api, page);
  }, []);

  const prevPage = () => {
    const prev = page - 1;
    setPage(prev);
    getDataFromApi(api, prev);
  };
  const nextPage = () => {
    const next = page + 1;
    setPage(next);
    getDataFromApi(api, next);
  };

  // charts

  return (
    <>
      <nav className="navbar navbar-dark sticky-top bg-primary flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="#">
          Technical Test
        </a>
        <button
          className="navbar-toggler position-absolute d-md-none collapsed"
          type="button"
          data-toggle="collapse"
          data-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <nav
            id="sidebarMenu"
            className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
          >
            <div className="sidebar-sticky pt-3">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <a className="nav-link active btn btn-primary mx-4" href="#">
                    <span data-feather="home"></span>
                    Dashboard <span className="sr-only">(current)</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
              <h1 className="h2">{display == "table" ? "Table" : "Graph"}</h1>
              <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group mr-2">
                  <button
                    type="button"
                    onClick={() => setDisplay("table")}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Table
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisplay("graph")}
                    className="btn btn-sm text-orange border-orange"
                  >
                    Graph
                  </button>
                </div>
              </div>
            </div>

            {display == "table" ? (
              <>
                <div
                  className="table-responsive shadow mb-4 border"
                  style={{ height: 600 }}
                >
                  <table className="table custom-table table-sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Height</th>
                        <th>Mass</th>
                        <th>Hair Color</th>
                        <th>Skin Color</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <>
                          {[...Array(10)].map((x, i) => (
                            <tr>
                              <td>
                                <Skeleton width={100} />
                              </td>
                              <td>
                                <Skeleton width={100} />
                              </td>
                              <td>
                                <Skeleton width={100} />
                              </td>
                              <td>
                                <Skeleton width={100} />
                              </td>
                              <td>
                                <Skeleton width={100} />
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <>
                          {peoples &&
                            peoples?.data &&
                            peoples?.data?.results.map((people, index) => {
                              return (
                                <tr key={index}>
                                  <td>{people.name}</td>
                                  <td
                                    className={
                                      people.height == "unknown"
                                        ? "text-red"
                                        : ""
                                    }
                                  >
                                    {people.height}
                                  </td>
                                  <td
                                    className={
                                      people.mass == "unknown" ? "text-red" : ""
                                    }
                                  >
                                    {people.mass}
                                  </td>
                                  <td
                                    className={
                                      people.hair_color == "n/a" ||
                                      people.hair_color == "none"
                                        ? "text-red"
                                        : ""
                                    }
                                  >
                                    {people.hair_color}
                                  </td>
                                  <td>{people.skin_color}</td>
                                </tr>
                              );
                            })}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div style={{ height: 500 }}>
                  <MyResponsiveBar data={data} />
                </div>
              </>
            )}

            <div className="d-flex justify-content-end">
              <div className="btn-toolbar mb-2 mb-md-0 ">
                <div className="btn-group mr-2">
                  {peoples?.data?.previous && isLoading == false ? (
                    <button
                      type="button"
                      onClick={() => prevPage()}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Previous
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      onClick={() => prevPage()}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Previous
                    </button>
                  )}

                  {peoples?.data?.next && isLoading == false ? (
                    <button
                      type="button"
                      onClick={() => nextPage()}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      onClick={() => nextPage()}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
