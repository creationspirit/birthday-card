import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import Scene from '../components/Scene'
import Cake from '../images/cake.svg'
import Gift from '../images/gift-box.svg'

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Sretan ti rođendan mišuuuu moooj!!!!!</h1>
    <p>
      Nadam se da si se naspavala i da si spremna za nove pobjede jer danas
      će ti bit jedan jako neobičan dan počevši od sad. Čini mi se da sam čuo negdje da se sprema neki Treasure Hunt!!!<br/><br/>
      Pa da odmah krenemo, evo imam tu nekoga tko jedva čeka da te pozdravi i da ti da jednu zagonetku.
      (Hint: možeš pričati s njim :) ) Klikni na gumb dole.
    </p>
    <img className="icon icon-left" src={Cake}/>
    <img className="icon icon-right" src={Gift}/>
    <Scene />
  </Layout>
)

export default IndexPage
