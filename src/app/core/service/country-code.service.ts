import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryCodeService {

  public codes = [
    {
      "country": "Aruba",
      "code": "+297",
      "flagUrl": "https://flagcdn.com/w320/aw.png"
    },
    {
      "country": "Afghanistan",
      "code": "+93",
      "flagUrl": "https://flagcdn.com/w320/af.png"
    },
    {
      "country": "Angola",
      "code": "+244",
      "flagUrl": "https://flagcdn.com/w320/ao.png"
    },
    {
      "country": "Anguilla",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/ai.png"
    },
    {
      "country": "Åland Islands",
      "code": "+358",
      "flagUrl": "https://flagcdn.com/w320/ax.png"
    },
    {
      "country": "Albania",
      "code": "+355",
      "flagUrl": "https://flagcdn.com/w320/al.png"
    },
    {
      "country": "Andorra",
      "code": "+376",
      "flagUrl": "https://flagcdn.com/w320/ad.png"
    },
    {
      "country": "United Arab Emirates",
      "code": "+971",
      "flagUrl": "https://flagcdn.com/w320/ae.png"
    },
    {
      "country": "Argentina",
      "code": "+54",
      "flagUrl": "https://flagcdn.com/w320/ar.png"
    },
    {
      "country": "Armenia",
      "code": "+374",
      "flagUrl": "https://flagcdn.com/w320/am.png"
    },
    {
      "country": "American Samoa",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/as.png"
    },
    {
      "country": "Antarctica",
      "code": "+672",
      "flagUrl": "https://flagcdn.com/w320/aq.png"
    },
    {
      "country": "French Southern Territories",
      "code": "+33",
      "flagUrl": "https://flagcdn.com/w320/tf.png"
    },
    {
      "country": "Antigua and Barbuda",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/ag.png"
    },
    {
      "country": "Australia",
      "code": "+61",
      "flagUrl": "https://flagcdn.com/w320/au.png"
    },
    {
      "country": "Austria",
      "code": "+43",
      "flagUrl": "https://flagcdn.com/w320/at.png"
    },
    {
      "country": "Azerbaijan",
      "code": "+994",
      "flagUrl": "https://flagcdn.com/w320/az.png"
    },
    {
      "country": "Burundi",
      "code": "+257",
      "flagUrl": "https://flagcdn.com/w320/bi.png"
    },
    {
      "country": "Belgium",
      "code": "+32",
      "flagUrl": "https://flagcdn.com/w320/be.png"
    },
    {
      "country": "Benin",
      "code": "+229",
      "flagUrl": "https://flagcdn.com/w320/bj.png"
    },
    {
      "country": "Bonaire, Sint Eustatius and Saba",
      "code": "+599",
      "flagUrl": "https://flagcdn.com/w320/bq.png"
    },
    {
      "country": "Burkina Faso",
      "code": "+226",
      "flagUrl": "https://flagcdn.com/w320/bf.png"
    },
    {
      "country": "Bangladesh",
      "code": "+880",
      "flagUrl": "https://flagcdn.com/w320/bd.png"
    },
    {
      "country": "Bulgaria",
      "code": "+359",
      "flagUrl": "https://flagcdn.com/w320/bg.png"
    },
    {
      "country": "Bahrain",
      "code": "+973",
      "flagUrl": "https://flagcdn.com/w320/bh.png"
    },
    {
      "country": "Bahamas",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/bs.png"
    },
    {
      "country": "Bosnia and Herzegovina",
      "code": "+387",
      "flagUrl": "https://flagcdn.com/w320/ba.png"
    },
    {
      "country": "Saint Barthélemy",
      "code": "+590",
      "flagUrl": "https://flagcdn.com/w320/bl.png"
    },
    {
      "country": "Belarus",
      "code": "+375",
      "flagUrl": "https://flagcdn.com/w320/by.png"
    },
    {
      "country": "Belize",
      "code": "+501",
      "flagUrl": "https://flagcdn.com/w320/bz.png"
    },
    {
      "country": "Bermuda",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/bm.png"
    },
    {
      "country": "Bolivia, Plurinational State of",
      "code": "+591",
      "flagUrl": "https://flagcdn.com/w320/bo.png"
    },
    {
      "country": "Brazil",
      "code": "+55",
      "flagUrl": "https://flagcdn.com/w320/br.png"
    },
    {
      "country": "Barbados",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/bb.png"
    },
    {
      "country": "Brunei Darussalam",
      "code": "+673",
      "flagUrl": "https://flagcdn.com/w320/bn.png"
    },
    {
      "country": "Bhutan",
      "code": "+975",
      "flagUrl": "https://flagcdn.com/w320/bt.png"
    },
    {
      "country": "Bouvet Island",
      "code": "+47",
      "flagUrl": "https://flagcdn.com/w320/bv.png"
    },
    {
      "country": "Botswana",
      "code": "+267",
      "flagUrl": "https://flagcdn.com/w320/bw.png"
    },
    {
      "country": "Central African Republic",
      "code": "+236",
      "flagUrl": "https://flagcdn.com/w320/cf.png"
    },
    {
      "country": "Canada",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/ca.png"
    },
    {
      "country": "Cocos (Keeling) Islands",
      "code": "+61 891",
      "flagUrl": "https://flagcdn.com/w320/cc.png"
    },
    {
      "country": "Switzerland",
      "code": "+41",
      "flagUrl": "https://flagcdn.com/w320/ch.png"
    },
    {
      "country": "Chile",
      "code": "+56",
      "flagUrl": "https://flagcdn.com/w320/cl.png"
    },
    {
      "country": "China",
      "code": "+86",
      "flagUrl": "https://flagcdn.com/w320/cn.png"
    },
    {
      "country": "C\u00f4te d'Ivoire",
      "code": "+225",
      "flagUrl": "https://flagcdn.com/w320/ci.png"
    },
    {
      "country": "Cameroon",
      "code": "+237",
      "flagUrl": "https://flagcdn.com/w320/cm.png"
    },
    {
      "country": "Congo, The Democratic Republic of the",
      "code": "+243",
      "flagUrl": "https://flagcdn.com/w320/cd.png"
    },
    {
      "country": "Congo",
      "code": "+242",
      "flagUrl": "https://flagcdn.com/w320/cg.png"
    },
    {
      "country": "Cook Islands",
      "code": "+682",
      "flagUrl": "https://flagcdn.com/w320/ck.png"
    },
    {
      "country": "Colombia",
      "code": "+57",
      "flagUrl": "https://flagcdn.com/w320/co.png"
    },
    {
      "country": "Comoros",
      "code": "+269",
      "flagUrl": "https://flagcdn.com/w320/km.png"
    },
    {
      "country": "Cabo Verde",
      "code": "+238",
      "flagUrl": "https://flagcdn.com/w320/cv.png"
    },
    {
      "country": "Costa Rica",
      "code": "+506",
      "flagUrl": "https://flagcdn.com/w320/cr.png"
    },
    {
      "country": "Cuba",
      "code": "+53",
      "flagUrl": "https://flagcdn.com/w320/cu.png"
    },
    {
      "country": "Curaçao",
      "code": "+599 9",
      "flagUrl": "https://flagcdn.com/w320/cw.png"
    },
    {
      "country": "Christmas Island",
      "code": "+61 891",
      "flagUrl": "https://flagcdn.com/w320/cx.png"
    },
    {
      "country": "Cayman Islands",
      "code": "+1 345",
      "flagUrl": "https://flagcdn.com/w320/ky.png"
    },
    {
      "country": "Cyprus",
      "code": "+357",
      "flagUrl": "https://flagcdn.com/w320/cy.png"
    },
    {
      "country": "Czechia",
      "code": "+420",
      "flagUrl": "https://flagcdn.com/w320/cz.png"
    },
    {
      "country": "Germany",
      "code": "+49",
      "flagUrl": "https://flagcdn.com/w320/de.png"
    },
    {
      "country": "Djibouti",
      "code": "+253",
      "flagUrl": "https://flagcdn.com/w320/dj.png"
    },
    {
      "country": "Dominica",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/dm.png"
    },
    {
      "country": "Denmark",
      "code": "+45",
      "flagUrl": "https://flagcdn.com/w320/dk.png"
    },
    {
      "country": "Dominican Republic",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/do.png"
    },
    {
      "country": "Algeria",
      "code": "+213",
      "flagUrl": "https://flagcdn.com/w320/dz.png"
    },
    {
      "country": "Ecuador",
      "code": "+593",
      "flagUrl": "https://flagcdn.com/w320/ec.png"
    },
    {
      "country": "Egypt",
      "code": "+20",
      "flagUrl": "https://flagcdn.com/w320/eg.png"
    },
    {
      "country": "Eritrea",
      "code": "+291",
      "flagUrl": "https://flagcdn.com/w320/er.png"
    },
    {
      "country": "Western Sahara",
      "code": "+212",
      "flagUrl": "https://flagcdn.com/w320/eh.png"
    },
    {
      "country": "Spain",
      "code": "+34",
      "flagUrl": "https://flagcdn.com/w320/es.png"
    },
    {
      "country": "Estonia",
      "code": "+372",
      "flagUrl": "https://flagcdn.com/w320/ee.png"
    },
    {
      "country": "Ethiopia",
      "code": "+251",
      "flagUrl": "https://flagcdn.com/w320/et.png"
    },
    {
      "country": "Finland",
      "code": "+358",
      "flagUrl": "https://flagcdn.com/w320/fi.png"
    },
    {
      "country": "Fiji",
      "code": "+679",
      "flagUrl": "https://flagcdn.com/w320/fj.png"
    },
    {
      "country": "Falkland Islands (Malvinas)",
      "code": "+500",
      "flagUrl": "https://flagcdn.com/w320/fk.png"
    },
    {
      "country": "France",
      "code": "+33",
      "flagUrl": "https://flagcdn.com/w320/fr.png"
    },
    {
      "country": "Faroe Islands",
      "code": "+298",
      "flagUrl": "https://flagcdn.com/w320/fo.png"
    },
    {
      "country": "Micronesia, Federated States of",
      "code": "+691",
      "flagUrl": "https://flagcdn.com/w320/fm.png"
    },
    {
      "country": "Gabon",
      "code": "+241",
      "flagUrl": "https://flagcdn.com/w320/ga.png"
    },
    {
      "country": "United Kingdom",
      "code": "+44",
      "flagUrl": "https://flagcdn.com/w320/gb.png"
    },
    {
      "country": "Georgia",
      "code": "+995",
      "flagUrl": "https://flagcdn.com/w320/ge.png"
    },
    {
      "country": "Guernsey",
      "code": "+44 1481",
      "flagUrl": "https://flagcdn.com/w320/gg.png"
    },
    {
      "country": "Ghana",
      "code": "+233",
      "flagUrl": "https://flagcdn.com/w320/gh.png"
    },
    {
      "country": "Gibraltar",
      "code": "+350",
      "flagUrl": "https://flagcdn.com/w320/gi.png"
    },
    {
      "country": "Guinea",
      "code": "+224",
      "flagUrl": "https://flagcdn.com/w320/gn.png"
    },
    {
      "country": "Guadeloupe",
      "code": "+590",
      "flagUrl": "https://flagcdn.com/w320/gp.png"
    },
    {
      "country": "Gambia",
      "code": "+220",
      "flagUrl": "https://flagcdn.com/w320/gm.png"
    },
    {
      "country": "Guinea-Bissau",
      "code": "+245",
      "flagUrl": "https://flagcdn.com/w320/gw.png"
    },
    {
      "country": "Equatorial Guinea",
      "code": "+240",
      "flagUrl": "https://flagcdn.com/w320/gq.png"
    },
    {
      "country": "Greece",
      "code": "+30",
      "flagUrl": "https://flagcdn.com/w320/gr.png"
    },
    {
      "country": "Grenada",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/gd.png"
    },
    {
      "country": "Greenland",
      "code": "+299",
      "flagUrl": "https://flagcdn.com/w320/gl.png"
    },
    {
      "country": "Guatemala",
      "code": "+502",
      "flagUrl": "https://flagcdn.com/w320/gt.png"
    },
    {
      "country": "French Guiana",
      "code": "+594",
      "flagUrl": "https://flagcdn.com/w320/gf.png"
    },
    {
      "country": "Guam",
      "code": "+1 671",
      "flagUrl": "https://flagcdn.com/w320/gu.png"
    },
    {
      "country": "Guyana",
      "code": "+592",
      "flagUrl": "https://flagcdn.com/w320/gy.png"
    },
    {
      "country": "Hong Kong",
      "code": "+852",
      "flagUrl": "https://flagcdn.com/w320/hk.png"
    },
    {
      "country": "Heard Island and McDonald Islands",
      "code": "+672",
      "flagUrl": "https://flagcdn.com/w320/hm.png"
    },
    {
      "country": "Honduras",
      "code": "+504",
      "flagUrl": "https://flagcdn.com/w320/hn.png"
    },
    {
      "country": "Croatia",
      "code": "+385",
      "flagUrl": "https://flagcdn.com/w320/hr.png"
    },
    {
      "country": "Haiti",
      "code": "+509",
      "flagUrl": "https://flagcdn.com/w320/ht.png"
    },
    {
      "country": "Hungary",
      "code": "+36",
      "flagUrl": "https://flagcdn.com/w320/hu.png"
    },
    {
      "country": "Indonesia",
      "code": "+62",
      "flagUrl": "https://flagcdn.com/w320/id.png"
    },
    {
      "country": "Isle of Man",
      "code": "+44 1624",
      "flagUrl": "https://flagcdn.com/w320/im.png"
    },
    {
      "country": "India",
      "code": "+91",
      "flagUrl": "https://flagcdn.com/w320/in.png"
    },
    {
      "country": "British Indian Ocean Territory",
      "code": "+246",
      "flagUrl": "https://flagcdn.com/w320/io.png"
    },
    {
      "country": "Ireland",
      "code": "+353",
      "flagUrl": "https://flagcdn.com/w320/ie.png"
    },
    {
      "country": "Iran, Islamic Republic of",
      "code": "+98",
      "flagUrl": "https://flagcdn.com/w320/ir.png"
    },
    {
      "country": "Iraq",
      "code": "+964",
      "flagUrl": "https://flagcdn.com/w320/iq.png"
    },
    {
      "country": "Iceland",
      "code": "+354",
      "flagUrl": "https://flagcdn.com/w320/is.png"
    },
    {
      "country": "Israel",
      "code": "+972",
      "flagUrl": "https://flagcdn.com/w320/il.png"
    },
    {
      "country": "Italy",
      "code": "+39",
      "flagUrl": "https://flagcdn.com/w320/it.png"
    },
    {
      "country": "Jamaica",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/jm.png"
    },
    {
      "country": "Jersey",
      "code": "+44 1534",
      "flagUrl": "https://flagcdn.com/w320/je.png"
    },
    {
      "country": "Jordan",
      "code": "+962",
      "flagUrl": "https://flagcdn.com/w320/jo.png"
    },
    {
      "country": "Japan",
      "code": "+81",
      "flagUrl": "https://flagcdn.com/w320/jp.png"
    },
    {
      "country": "Kazakhstan",
      "code": "+7",
      "flagUrl": "https://flagcdn.com/w320/kz.png"
    },
    {
      "country": "Kenya",
      "code": "+254",
      "flagUrl": "https://flagcdn.com/w320/ke.png"
    },
    {
      "country": "Kyrgyzstan",
      "code": "+996",
      "flagUrl": "https://flagcdn.com/w320/kg.png"
    },
    {
      "country": "Cambodia",
      "code": "+855",
      "flagUrl": "https://flagcdn.com/w320/kh.png"
    },
    {
      "country": "Kiribati",
      "code": "+686",
      "flagUrl": "https://flagcdn.com/w320/ki.png"
    },
    {
      "country": "Saint Kitts and Nevis",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/kn.png"
    },
    {
      "country": "Korea, Republic of",
      "code": "+82",
      "flagUrl": "https://flagcdn.com/w320/kr.png"
    },
    {
      "country": "Kuwait",
      "code": "+965",
      "flagUrl": "https://flagcdn.com/w320/kw.png"
    },
    {
      "country": "Lao People's Democratic Republic",
      "code": "+856",
      "flagUrl": "https://flagcdn.com/w320/la.png"
    },
    {
      "country": "Lebanon",
      "code": "+961",
      "flagUrl": "https://flagcdn.com/w320/lb.png"
    },
    {
      "country": "Liberia",
      "code": "+231",
      "flagUrl": "https://flagcdn.com/w320/lr.png"
    },
    {
      "country": "Libya",
      "code": "+218",
      "flagUrl": "https://flagcdn.com/w320/ly.png"
    },
    {
      "country": "Saint Lucia",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/lc.png"
    },
    {
      "country": "Liechtenstein",
      "code": "+423",
      "flagUrl": "https://flagcdn.com/w320/li.png"
    },
    {
      "country": "Sri Lanka",
      "code": "+94",
      "flagUrl": "https://flagcdn.com/w320/lk.png"
    },
    {
      "country": "Lesotho",
      "code": "+266",
      "flagUrl": "https://flagcdn.com/w320/ls.png"
    },
    {
      "country": "Lithuania",
      "code": "+370",
      "flagUrl": "https://flagcdn.com/w320/lt.png"
    },
    {
      "country": "Luxembourg",
      "code": "+352",
      "flagUrl": "https://flagcdn.com/w320/lu.png"
    },
    {
      "country": "Latvia",
      "code": "+371",
      "flagUrl": "https://flagcdn.com/w320/lv.png"
    },
    {
      "country": "Macao",
      "code": "+853",
      "flagUrl": "https://flagcdn.com/w320/mo.png"
    },
    {
      "country": "Saint Martin (French part)",
      "code": "+590",
      "flagUrl": "https://flagcdn.com/w320/mf.png"
    },
    {
      "country": "Morocco",
      "code": "+212",
      "flagUrl": "https://flagcdn.com/w320/ma.png"
    },
    {
      "country": "Monaco",
      "code": "+377",
      "flagUrl": "https://flagcdn.com/w320/mc.png"
    },
    {
      "country": "Moldova, Republic of",
      "code": "+373",
      "flagUrl": "https://flagcdn.com/w320/md.png"
    },
    {
      "country": "Madagascar",
      "code": "+261",
      "flagUrl": "https://flagcdn.com/w320/mg.png"
    },
    {
      "country": "Maldives",
      "code": "+960",
      "flagUrl": "https://flagcdn.com/w320/mv.png"
    },
    {
      "country": "Mexico",
      "code": "+52",
      "flagUrl": "https://flagcdn.com/w320/mx.png"
    },
    {
      "country": "Marshall Islands",
      "code": "+692",
      "flagUrl": "https://flagcdn.com/w320/mh.png"
    },
    {
      "country": "North Macedonia",
      "code": "+389",
      "flagUrl": "https://flagcdn.com/w320/mk.png"
    },
    {
      "country": "Mali",
      "code": "+223",
      "flagUrl": "https://flagcdn.com/w320/ml.png"
    },
    {
      "country": "Malta",
      "code": "+356",
      "flagUrl": "https://flagcdn.com/w320/mt.png"
    },
    {
      "country": "Myanmar",
      "code": "+95",
      "flagUrl": "https://flagcdn.com/w320/mm.png"
    },
    {
      "country": "Montenegro",
      "code": "+382",
      "flagUrl": "https://flagcdn.com/w320/me.png"
    },
    {
      "country": "Mongolia",
      "code": "+976",
      "flagUrl": "https://flagcdn.com/w320/mn.png"
    },
    {
      "country": "Northern Mariana Islands",
      "code": "+1 670",
      "flagUrl": "https://flagcdn.com/w320/mp.png"
    },
    {
      "country": "Mozambique",
      "code": "+258",
      "flagUrl": "https://flagcdn.com/w320/mz.png"
    },
    {
      "country": "Mauritania",
      "code": "+222",
      "flagUrl": "https://flagcdn.com/w320/mr.png"
    },
    {
      "country": "Montserrat",
      "code": "+1 664",
      "flagUrl": "https://flagcdn.com/w320/ms.png"
    },
    {
      "country": "Martinique",
      "code": "+596",
      "flagUrl": "https://flagcdn.com/w320/mq.png"
    },
    {
      "country": "Mauritius",
      "code": "+230",
      "flagUrl": "https://flagcdn.com/w320/mu.png"
    },
    {
      "country": "Malawi",
      "code": "+265",
      "flagUrl": "https://flagcdn.com/w320/mw.png"
    },
    {
      "country": "Malaysia",
      "code": "+60",
      "flagUrl": "https://flagcdn.com/w320/my.png"
    },
    {
      "country": "Mayotte",
      "code": "+262",
      "flagUrl": "https://flagcdn.com/w320/yt.png"
    },
    {
      "country": "Namibia",
      "code": "+264",
      "flagUrl": "https://flagcdn.com/w320/na.png"
    },
    {
      "country": "New Caledonia",
      "code": "+687",
      "flagUrl": "https://flagcdn.com/w320/nc.png"
    },
    {
      "country": "Niger",
      "code": "+227",
      "flagUrl": "https://flagcdn.com/w320/ne.png"
    },
    {
      "country": "Norfolk Island",
      "code": "+672",
      "flagUrl": "https://flagcdn.com/w320/nf.png"
    },
    {
      "country": "Nigeria",
      "code": "+234",
      "flagUrl": "https://flagcdn.com/w320/ng.png"
    },
    {
      "country": "Nicaragua",
      "code": "+505",
      "flagUrl": "https://flagcdn.com/w320/ni.png"
    },
    {
      "country": "Niue",
      "code": "+683",
      "flagUrl": "https://flagcdn.com/w320/nu.png"
    },
    {
      "country": "Netherlands",
      "code": "+31",
      "flagUrl": "https://flagcdn.com/w320/nl.png"
    },
    {
      "country": "Norway",
      "code": "+47",
      "flagUrl": "https://flagcdn.com/w320/no.png"
    },
    {
      "country": "Nepal",
      "code": "+977",
      "flagUrl": "https://flagcdn.com/w320/np.png"
    },
    {
      "country": "Nauru",
      "code": "+674",
      "flagUrl": "https://flagcdn.com/w320/nr.png"
    },
    {
      "country": "New Zealand",
      "code": "+64",
      "flagUrl": "https://flagcdn.com/w320/nz.png"
    },
    {
      "country": "Oman",
      "code": "+968",
      "flagUrl": "https://flagcdn.com/w320/om.png"
    },
    {
      "country": "Pakistan",
      "code": "+92",
      "flagUrl": "https://flagcdn.com/w320/pk.png"
    },
    {
      "country": "Panama",
      "code": "+507",
      "flagUrl": "https://flagcdn.com/w320/pa.png"
    },
    {
      "country": "Pitcairn",
      "code": "+64",
      "flagUrl": "https://flagcdn.com/w320/pn.png"
    },
    {
      "country": "Peru",
      "code": "+51",
      "flagUrl": "https://flagcdn.com/w320/pe.png"
    },
    {
      "country": "Philippines",
      "code": "+63",
      "flagUrl": "https://flagcdn.com/w320/ph.png"
    },
    {
      "country": "Palau",
      "code": "+680",
      "flagUrl": "https://flagcdn.com/w320/pw.png"
    },
    {
      "country": "Papua New Guinea",
      "code": "+675",
      "flagUrl": "https://flagcdn.com/w320/pg.png"
    },
    {
      "country": "Poland",
      "code": "+48",
      "flagUrl": "https://flagcdn.com/w320/pl.png"
    },
    {
      "country": "Puerto Rico",
      "code": "+1 787",
      "flagUrl": "https://flagcdn.com/w320/pr.png"
    },
    {
      "country": "Korea, Democratic People's Republic of",
      "code": "+850",
      "flagUrl": "https://flagcdn.com/w320/kp.png"
    },
    {
      "country": "Portugal",
      "code": "+351",
      "flagUrl": "https://flagcdn.com/w320/pt.png"
    },
    {
      "country": "Paraguay",
      "code": "+595",
      "flagUrl": "https://flagcdn.com/w320/py.png"
    },
    {
      "country": "Palestine, State of Palestine",
      "code": "+970",
      "flagUrl": "https://flagcdn.com/w320/ps.png"
    },
    {
      "country": "French Polynesia",
      "code": "+689",
      "flagUrl": "https://flagcdn.com/w320/pf.png"
    },
    {
      "country": "Qatar",
      "code": "+974",
      "flagUrl": "https://flagcdn.com/w320/qa.png"
    },
    {
      "country": "Réunion",
      "code": "+262",
      "flagUrl": "https://flagcdn.com/w320/re.png"
    },
    {
      "country": "Romania",
      "code": "+40",
      "flagUrl": "https://flagcdn.com/w320/ro.png"
    },
    {
      "country": "Russian Federation",
      "code": "+7",
      "flagUrl": "https://flagcdn.com/w320/ru.png"
    },
    {
      "country": "Rwanda",
      "code": "+250",
      "flagUrl": "https://flagcdn.com/w320/rw.png"
    },
    {
      "country": "Saudi Arabia",
      "code": "+966",
      "flagUrl": "https://flagcdn.com/w320/sa.png"
    },
    {
      "country": "Sudan",
      "code": "+249",
      "flagUrl": "https://flagcdn.com/w320/sd.png"
    },
    {
      "country": "Senegal",
      "code": "+221",
      "flagUrl": "https://flagcdn.com/w320/sn.png"
    },
    {
      "country": "Singapore",
      "code": "+65",
      "flagUrl": "https://flagcdn.com/w320/sg.png"
    },
    {
      "country": "South Georgia and the South Sandwich Islands",
      "code": "+500",
      "flagUrl": "https://flagcdn.com/w320/gs.png"
    },
    {
      "country": "Saint Helena, Ascension and Tristan da Cunha",
      "code": "+290",
      "flagUrl": "https://flagcdn.com/w320/sh.png"
    },
    {
      "country": "Svalbard and Jan Mayen",
      "code": "+47",
      "flagUrl": "https://flagcdn.com/w320/sj.png"
    },
    {
      "country": "Solomon Islands",
      "code": "+677",
      "flagUrl": "https://flagcdn.com/w320/sb.png"
    },
    {
      "country": "Sierra Leone",
      "code": "+232",
      "flagUrl": "https://flagcdn.com/w320/sl.png"
    },
    {
      "country": "El Salvador",
      "code": "+503",
      "flagUrl": "https://flagcdn.com/w320/sv.png"
    },
    {
      "country": "San Marino",
      "code": "+378",
      "flagUrl": "https://flagcdn.com/w320/sm.png"
    },
    {
      "country": "Somalia",
      "code": "+252",
      "flagUrl": "https://flagcdn.com/w320/so.png"
    },
    {
      "country": "Saint Pierre and Miquelon",
      "code": "+508",
      "flagUrl": "https://flagcdn.com/w320/pm.png"
    },
    {
      "country": "Serbia",
      "code": "+381",
      "flagUrl": "https://flagcdn.com/w320/rs.png"
    },
    {
      "country": "South Sudan",
      "code": "+211",
      "flagUrl": "https://flagcdn.com/w320/ss.png"
    },
    {
      "country": "Sao Tome and Principe",
      "code": "+239",
      "flagUrl": "https://flagcdn.com/w320/st.png"
    },
    {
      "country": "Suriname",
      "code": "+597",
      "flagUrl": "https://flagcdn.com/w320/sr.png"
    },
    {
      "country": "Slovakia",
      "code": "+421",
      "flagUrl": "https://flagcdn.com/w320/sk.png"
    },
    {
      "country": "Slovenia",
      "code": "+386",
      "flagUrl": "https://flagcdn.com/w320/si.png"
    },
    {
      "country": "Sweden",
      "code": "+46",
      "flagUrl": "https://flagcdn.com/w320/se.png"
    },
    {
      "country": "Eswatini",
      "code": "+268",
      "flagUrl": "https://flagcdn.com/w320/sz.png"
    },
    {
      "country": "Sint Maarten (Dutch part)",
      "code": "+1 721",
      "flagUrl": "https://flagcdn.com/w320/sx.png"
    },
    {
      "country": "Seychelles",
      "code": "+248",
      "flagUrl": "https://flagcdn.com/w320/sc.png"
    },
    {
      "country": "Syrian Arab Republic",
      "code": "+963",
      "flagUrl": "https://flagcdn.com/w320/sy.png"
    },
    {
      "country": "Turks and Caicos Islands",
      "code": "+1 649",
      "flagUrl": "https://flagcdn.com/w320/tc.png"
    },
    {
      "country": "Chad",
      "code": "+235",
      "flagUrl": "https://flagcdn.com/w320/td.png"
    },
    {
      "country": "Togo",
      "code": "+228",
      "flagUrl": "https://flagcdn.com/w320/tg.png"
    },
    {
      "country": "Thailand",
      "code": "+66",
      "flagUrl": "https://flagcdn.com/w320/th.png"
    },
    {
      "country": "Tajikistan",
      "code": "+992",
      "flagUrl": "https://flagcdn.com/w320/tj.png"
    },
    {
      "country": "Tokelau",
      "code": "+690",
      "flagUrl": "https://flagcdn.com/w320/tk.png"
    },
    {
      "country": "Turkmenistan",
      "code": "+993",
      "flagUrl": "https://flagcdn.com/w320/tm.png"
    },
    {
      "country": "Timor-Leste",
      "code": "+670",
      "flagUrl": "https://flagcdn.com/w320/tl.png"
    },
    {
      "country": "Tonga",
      "code": "+676",
      "flagUrl": "https://flagcdn.com/w320/to.png"
    },
    {
      "country": "Trinidad and Tobago",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/tt.png"
    },
    {
      "country": "Tunisia",
      "code": "+216",
      "flagUrl": "https://flagcdn.com/w320/tn.png"
    },
    {
      "country": "Turkey",
      "code": "+90",
      "flagUrl": "https://flagcdn.com/w320/tr.png"
    },
    {
      "country": "Tuvalu",
      "code": "+688",
      "flagUrl": "https://flagcdn.com/w320/tv.png"
    },
    {
      "country": "Taiwan, Province of China",
      "code": "+886",
      "flagUrl": "https://flagcdn.com/w320/tw.png"
    },
    {
      "country": "Tanzania, United Republic of",
      "code": "+255",
      "flagUrl": "https://flagcdn.com/w320/tz.png"
    },
    {
      "country": "Uganda",
      "code": "+256",
      "flagUrl": "https://flagcdn.com/w320/ug.png"
    },
    {
      "country": "Ukraine",
      "code": "+380",
      "flagUrl": "https://flagcdn.com/w320/ua.png"
    },
    {
      "country": "United States Minor Outlying Islands",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/um.png"
    },
    {
      "country": "Uruguay",
      "code": "+598",
      "flagUrl": "https://flagcdn.com/w320/uy.png"
    },
    {
      "country": "United States",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/us.png"
    },
    {
      "country": "Uzbekistan",
      "code": "+998",
      "flagUrl": "https://flagcdn.com/w320/uz.png"
    },
    {
      "country": "Holy See (Vatican City State)",
      "code": "+379",
      "flagUrl": "https://flagcdn.com/w320/va.png"
    },
    {
      "country": "Saint Vincent and the Grenadines",
      "code": "+1",
      "flagUrl": "https://flagcdn.com/w320/vc.png"
    },
    {
      "country": "Venezuela, Bolivarian Republic of",
      "code": "+58",
      "flagUrl": "https://flagcdn.com/w320/ve.png"
    },
    {
      "country": "Virgin Islands, British",
      "code": "+1 284",
      "flagUrl": "https://flagcdn.com/w320/vg.png"
    },
    {
      "country": "Virgin Islands, U.S.",
      "code": "+1 340",
      "flagUrl": "https://flagcdn.com/w320/vi.png"
    },
    {
      "country": "Viet Nam",
      "code": "+84",
      "flagUrl": "https://flagcdn.com/w320/vn.png"
    },
    {
      "country": "Vanuatu",
      "code": "+678",
      "flagUrl": "https://flagcdn.com/w320/vu.png"
    },
    {
      "country": "Wallis and Futuna",
      "code": "+681",
      "flagUrl": "https://flagcdn.com/w320/wf.png"
    },
    {
      "country": "Samoa",
      "code": "+685",
      "flagUrl": "https://flagcdn.com/w320/ws.png"
    },
    {
      "country": "Yemen",
      "code": "+967",
      "flagUrl": "https://flagcdn.com/w320/ye.png"
    },
    {
      "country": "South Africa",
      "code": "+27",
      "flagUrl": "https://flagcdn.com/w320/za.png"
    },
    {
      "country": "Zambia",
      "code": "+260",
      "flagUrl": "https://flagcdn.com/w320/zm.png"
    },
    {
      "country": "Zimbabwe",
      "code": "+263",
      "flagUrl": "https://flagcdn.com/w320/zw.png"
    }
  ];
}
