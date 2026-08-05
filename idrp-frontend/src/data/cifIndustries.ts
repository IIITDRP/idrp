export interface CifIndustry {
  id: number
  name: string
  category: string
  manufacturingFocus: string
  commonMachinery: string[]
}

export const cifIndustries: CifIndustry[] = [
  {
  id: 1,
  name: "North Karnataka Small Scale Industries Association (NKSSIA)",
  category: "Industrial Automation, Machinery & Training",
  manufacturingFocus:
    "An apex body and association representing over 900 small-scale industries in the region. It provides a platform for networking, policy advocacy, and collective growth for member units.",
  commonMachinery: [
    "This is a trade association, not a manufacturing unit itself."
  ]
},

{
  id: 2,
  name: "Fasteners & Allied Products Pvt Ltd",
  category: "Precision Tools & Industrial Components",
  manufacturingFocus:
    "Manufacture of fasteners and other allied industrial products. This typically includes nuts, bolts, screws, rivets, and washers.",
  commonMachinery: [
    "Cold Forging Machines",
    "Thread Rolling Machines",
    "Wire Drawing Machines",
    "CNC Turning Centers",
    "Head Slotting Machines",
    "Heat Treatment Furnaces"
  ]
},

{
  id: 3,
  name: "Sonic Industries",
  category: "Plastics & Packaging",
  manufacturingFocus:
    "Supplier of high-quality packaging machinery and advanced batch coding systems. Serves the pharmaceutical, food & beverage, cosmetics, and chemical industries.",
  commonMachinery: [
    "Automatic Packaging Lines",
    "Filling & Sealing Machines",
    "Labeling Systems",
    "Batch Coding & Laser Marking Equipment",
    "Inspection Systems"
  ]
},

{
  id: 4,
  name: "Chetan Metals",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Metal manufacturing and fabrication. This likely involves the production of metal components, structures, or sheets.",
  commonMachinery: [
    "Shearing Machines",
    "Press Brakes",
    "CNC Laser Cutting Machines",
    "Welding Equipment (Arc, MIG, TIG)",
    "Plate Bending Rolls"
  ]
},

{
  id: 5,
  name: "Vedant Polyplast",
  category: "Plastics & Packaging",
  manufacturingFocus:
    "Manufacturing of plastic products, likely injection-moulded or blow-moulded components.",
  commonMachinery: [
    "Injection Moulding Machines (e.g., Arburg, Demag)",
    "Blow Moulding Machines",
    "Plastic Extruders",
    "Mould Temperature Controllers"
  ]
},

{
  id: 6,
  name: "Amrit Interiors / RAMDEV INTERIORS",
  category: "Furniture & Interiors",
  manufacturingFocus:
    "Interior design and fit-out solutions. This includes modular furniture, wood paneling, and custom joinery.",
  commonMachinery: [
    "CNC Routers",
    "Edge Banding Machines",
    "Panel Saws",
    "Thickness Planers",
    "Belt Sanders"
  ]
},

{
  id: 7,
  name: "Karnataka Foundry",
  category: "Foundry & Metal Casting",
  manufacturingFocus:
    "Metal casting, producing parts from iron, steel, or non-ferrous metals.",
  commonMachinery: [
    "Induction Furnaces",
    "Molding Machines",
    "Sand Mixers",
    "Shot Blasting Equipment",
    "CNC Machining Centers for finishing"
  ]
},

{
  id: 8,
  name: "TSflo Quality Valves",
  category: "Flow Control, Process & Water Systems",
  manufacturingFocus:
    "Manufacturer of high-quality industrial valves for flow control.",
  commonMachinery: [
    "CNC Turning Centers",
    "CNC Machining Centers",
    "Horizontal Boring Machines",
    "Coordinate Measuring Machines (CMM) for inspection",
    "Hydraulic Testing Rigs"
  ]
},

{
  id: 9,
  name: "C.P.V Engineering Pvt. Ltd.",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "General engineering and manufacturing, likely producing components for other industries.",
  commonMachinery: [
    "Center Lathes",
    "Milling Machines (Vertical & Universal)",
    "Drilling Machines",
    "Surface Grinders",
    "Welding Sets"
  ]
},

{
  id: 10,
  name: "SKYTECH CAPS & CLOSURES",
  category: "Plastics & Packaging",
  manufacturingFocus:
    "Manufacture of caps, closures, and packaging components, primarily for the pharmaceutical and beverage industries.",
  commonMachinery: [
    "Injection Moulding Machines",
    "Compression Molding Machines",
    "Printing Machines (for branding on caps)",
    "Capping Machines"
  ]
},

{
  id: 11,
  name: "Skytech Dies and Moulds Private Limited",
  category: "Precision Tools & Industrial Components",
  manufacturingFocus:
    "Precision tooling and mould-making. They design and manufacture dies for stamping, forging, and injection moulds for plastics.",
  commonMachinery: [
    "CNC EDM (Sinker & Wire Cut)",
    "CNC Milling Machines (HSC)",
    "Surface & Cylindrical Grinders",
    "Coordinate Measuring Machines (CMM) for precision inspection"
  ]
},

{
  id: 12,
  name: "Gudisagar Associates",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Likely a trading, consultancy, or agency for industrial products, but could also be a manufacturing unit for engineering components.",
  commonMachinery: [
    "Inspection & Measuring Instruments"
  ]
},

{
  id: 13,
  name: "Advance Die-Cast",
  category: "Foundry & Metal Casting",
  manufacturingFocus:
    "Manufacturing of precision components using the die-casting process (typically aluminum, zinc, or magnesium).",
  commonMachinery: [
    "Hot Chamber & Cold Chamber Die-Casting Machines",
    "Trimming Presses",
    "Shot Blasting Machines",
    "CNC Machining Centers"
  ]
},

{
  id: 14,
  name: "Shri Sai Furniture Works & Sales",
  category: "Furniture & Interiors",
  manufacturingFocus:
    "Manufacturing and sales of furniture.",
  commonMachinery: [
    "Table Saws",
    "Thickness Planers",
    "Router Machines",
    "Edge Banders",
    "Sanding Machines",
    "CNC Routers for complex designs"
  ]
},

{
  id: 15,
  name: "Rajalakshmi Industries",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "A diversified industrial name. The focus is likely on manufacturing components for the automotive or general engineering sector.",
  commonMachinery: [
    "Potentially CNC Turning Centers",
    "Center Lathes",
    "Milling Machines",
    "Grinding Machines"
  ]
},

{
  id: 16,
  name: "Mahabal Auto Ancillaries Pvt Ltd",
  category: "Automotive & Auto Ancillaries",
  manufacturingFocus:
    "Manufacture of auto components and ancillaries for the automotive industry.",
  commonMachinery: [
    "CNC Turning & Machining Centers",
    "Forging Presses",
    "Heat Treatment Lines",
    "Precision Measuring Equipment"
  ]
},

{
  id: 17,
  name: "Highco Engineers Pvt Ltd - Dharwad",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Manufacture of structural metal products, tanks, and reservoirs (based on their registered activity).",
  commonMachinery: [
    "Shearing Machines",
    "Plate Bending Rolls",
    "Welding Transformers",
    "Radial Drilling Machines",
    "Overhead Cranes for heavy lifting"
  ]
},

{
  id: 18,
  name: "Kwality Die-Casting Pvt Ltd",
  category: "Foundry & Metal Casting",
  manufacturingFocus:
    "Die-casting of high-quality metal components.",
  commonMachinery: [
    "Die-Casting Machines (Hot and Cold Chamber)",
    "Trimming Presses",
    "Shot Blasting Equipment",
    "CNC Machining Centers"
  ]
},

{
  id: 19,
  name: "CHANAKYA Engineering Works",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "General job work and engineering services, producing parts and components for various industries.",
  commonMachinery: [
    "Center Lathes",
    "Universal Milling Machines",
    "Shaper Machines",
    "Drilling Machines"
  ]
},

{
  id: 20,
  name: "Shri Sairam Engineering Works",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Engineering works, likely focusing on fabrication and machining.",
  commonMachinery: [
    "Shearing Machines",
    "Press Brakes",
    "Welding Sets",
    "Center Lathes",
    "Milling Machines"
  ]
},
{
  id: 21,
  name: "Immortal Valves Pvt Ltd",
  category: "Flow Control, Process & Water Systems",
  manufacturingFocus:
    "Manufacturing of industrial valves for various applications, including possibly oil & gas.",
  commonMachinery: [
    "CNC Turning Centers",
    "CNC Machining Centers",
    "Horizontal Boring Mills",
    "Hydraulic Testing Pumps"
  ]
},

{
  id: 22,
  name: "Raghav Forge Private Limited",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Hot forging of metal components. Products may include crankshafts, connecting rods, or other heavy parts.",
  commonMachinery: [
    "Forging Presses (Hydraulic & Mechanical)",
    "Hammer Forging Machines",
    "Induction Heaters",
    "Trimming Presses",
    "Heat Treatment Furnaces"
  ]
},

{
  id: 23,
  name: "PRIME Tool Tech",
  category: "Precision Tools & Industrial Components",
  manufacturingFocus:
    "Precision tool making and technical solutions for manufacturing.",
  commonMachinery: [
    "CNC Milling & Turning Centers",
    "EDM Machines",
    "CNC Wire-Cut EDM",
    "Tool & Cutter Grinders"
  ]
},

{
  id: 24,
  name: "B J VALVES PVT LTD",
  category: "Flow Control, Process & Water Systems",
  manufacturingFocus:
    "Manufacturing of valves and related flow control equipment.",
  commonMachinery: [
    "CNC Lathes",
    "CNC Machining Centers",
    "Special Boring Machines",
    "Pressure Testing Equipment"
  ]
},

{
  id: 25,
  name: "SHREE SAI ENGINEERING & POWDER COATING CO",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Engineering services and specialized powder coating for metal finishing.",
  commonMachinery: [
    "Surface Preparation Equipment (Shot Blasting, Chemical Cleaning)",
    "Powder Coating Booths",
    "Curing Ovens",
    "Compressed Air Systems for application"
  ]
},

{
  id: 26,
  name: "Advance Engineering Works",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "General engineering and fabrication services.",
  commonMachinery: [
    "Lathe Machines",
    "Milling Machines",
    "Drilling Machines",
    "Shearing Machines",
    "Welding Equipment"
  ]
},

{
  id: 27,
  name: "Bhanu Tools",
  category: "Precision Tools & Industrial Components",
  manufacturingFocus:
    "Manufacturing of industrial tools, cutting tools, or dies.",
  commonMachinery: [
    "CNC Grinding Machines (e.g., Cylindrical & Centerless)",
    "EDM Machines",
    "Milling Machines",
    "Heat Treatment Furnaces"
  ]
},

{
  id: 28,
  name: "S.P.K. Industries",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Likely a manufacturing unit for engineering or industrial components.",
  commonMachinery: [
    "Lathes",
    "Milling Machines",
    "Drilling Machines"
  ]
},

{
  id: 29,
  name: "SHRI RENUKA INDUSTRIES",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "A versatile industrial name, often associated with engineering or ancillary products.",
  commonMachinery: [
    "Lathes",
    "Milling Machines",
    "Grinders",
    "Welding Sets"
  ]
},

{
  id: 30,
  name: "VINAYAKA ENGINEERING",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Engineering works, likely providing machining or fabrication services.",
  commonMachinery: [
    "Center Lathes",
    "Vertical/Horizontal Milling Machines",
    "Shaper",
    "Drill Presses",
    "Band Saws"
  ]
},

{
  id: 31,
  name: "BALAJI INDUSTRIES",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "A common industrial name; likely involved in manufacturing components for a specific industry like automotive or general engineering.",
  commonMachinery: [
    "CNC Turning Centers",
    "Center Lathes",
    "Surface Grinders",
    "Drilling Machines"
  ]
},

{
  id: 32,
  name: "S V INDUSTRIES",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "General engineering and manufacturing.",
  commonMachinery: [
    "Lathe Machines",
    "Milling Machines",
    "Drilling Machines",
    "Grinding Machines"
  ]
},

{
  id: 33,
  name: "Nettur Technical Training Foundation (NTTF) Dharwad Branch",
  category: "Industrial Automation, Machinery & Training",
  manufacturingFocus:
    "NTTF is a premier technical training institution, not a manufacturer. It provides vocational education in tool engineering, mechatronics, and manufacturing. Established in Dharwad in 1964.",
  commonMachinery: [
    "CNC Machines",
    "EDM Wire-Cut",
    "Conventional Lathes",
    "3D Printers"
  ]
},

{
  id: 34,
  name: "VEETECH VALVES PVT. LTD.",
  category: "Flow Control, Process & Water Systems",
  manufacturingFocus:
    "Manufacturing of valves, which are crucial for controlling the flow of liquids and gases.",
  commonMachinery: [
    "CNC Turning Centers",
    "CNC Machining Centers",
    "Valve Test Benches",
    "Threading Machines"
  ]
},

{
  id: 35,
  name: "SHRADDHA Tools & Dies",
  category: "Precision Tools & Industrial Components",
  manufacturingFocus:
    "Design and manufacture of precision tools, dies, and moulds.",
  commonMachinery: [
    "CNC Milling",
    "CNC EDM (Wire & Sinker)",
    "Precision Grinders",
    "CMM for quality assurance"
  ]
},

{
  id: 36,
  name: "2L Engineers",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Engineering services, likely in design, drafting, or manufacturing support.",
  commonMachinery: [
    "CAD/CAM Software Workstations",
    "CNC Machines",
    "Conventional Lathes"
  ]
},

{
  id: 37,
  name: "AKHIL Controls",
  category: "Industrial Automation, Machinery & Training",
  manufacturingFocus:
    "Likely manufacturing of control panels, automation systems, or electronic control units.",
  commonMachinery: [
    "Panel Bending Machines",
    "Laser Cutting Machines",
    "Soldering & Assembly Tools",
    "Testing/Calibration Equipment"
  ]
},

{
  id: 38,
  name: "V CAP INDUSTRIES",
  category: "Plastics & Packaging",
  manufacturingFocus:
    "Manufacturing of caps and closures, similar to Skytech Caps & Closures.",
  commonMachinery: [
    "Injection Moulding Machines",
    "Compression Molding Presses",
    "Printing Machinery",
    "Molding/Assembly Automation"
  ]
},

{
  id: 39,
  name: "MICROTECH INDIA",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Likely involved in precision manufacturing, micro-machining, or electronics.",
  commonMachinery: [
    "Micro-CNC Machines",
    "Wire-Cut EDM",
    "Precision Grinding Equipment",
    "Vision Measuring Systems"
  ]
},

{
  id: 40,
  name: "MAHALAXMI IMPLIMENTS",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Manufacturing of agricultural implements and tools.",
  commonMachinery: [
    "Forging Hammers",
    "Power Presses",
    "Welding Equipment",
    "Shearing Machines",
    "CNC Plasma Cutting Machines"
  ]
},
{
  id: 41,
  name: "JUNJA HYDRAULICS",
  category: "Flow Control, Process & Water Systems",
  manufacturingFocus:
    "Manufacturing of hydraulic components like cylinders, valves, and pumps.",
  commonMachinery: [
    "CNC Turning Centers (for cylinder rods)",
    "Deep Hole Boring Machines",
    "Honing Machines",
    "Hydraulic Test Rigs"
  ]
},

{
  id: 42,
  name: "Shiva Industries",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "General manufacturing of engineering or ancillary products.",
  commonMachinery: [
    "General Engineering Equipment: Lathes",
    "Milling Machines",
    "Drilling Machines",
    "Grinding Machines"
  ]
},

{
  id: 43,
  name: "S P Industries",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Similar to other industrial firms, likely producing engineering components.",
  commonMachinery: [
    "Lathes",
    "Milling Machines",
    "Drilling Machines"
  ]
},

{
  id: 44,
  name: "Shafi General Engineering Works",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "General engineering services, providing repair and fabrication.",
  commonMachinery: [
    "Lathes",
    "Milling Machines",
    "Drilling Machines",
    "Welding Sets",
    "Power Presses"
  ]
},

{
  id: 45,
  name: "Prarthana Engineering Works",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Engineering and fabrication works.",
  commonMachinery: [
    "Lathes",
    "Milling Machines",
    "Shearing Machines",
    "Press Brakes",
    "Welding Equipment"
  ]
},

{
  id: 46,
  name: "J.B. Dani and Co.",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Likely a trading or manufacturing firm for industrial goods.",
  commonMachinery: [
    "Lathes",
    "Drills",
    "Grinders"
  ]
},

{
  id: 47,
  name: "Shri Balaji Industries",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "General manufacturing in the engineering sector.",
  commonMachinery: [
    "Lathe Machines",
    "Milling Machines",
    "Drilling Machines"
  ]
},

{
  id: 48,
  name: "DANI'S General Mechanical Works",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "General mechanical engineering and repair work.",
  commonMachinery: [
    "Lathes",
    "Milling Machines",
    "Shapers",
    "Planers",
    "Drilling Machines"
  ]
},

{
  id: 49,
  name: "Viraj Engineering Works",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Engineering works, likely fabrication and machining.",
  commonMachinery: [
    "Power Presses",
    "Shearing Machines",
    "Welding Equipment",
    "Lathes",
    "Milling Machines"
  ]
},

{
  id: 50,
  name: "JAI Engineering Works",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Engineering, manufacturing, or fabrication services.",
  commonMachinery: [
    "Standard engineering workshop equipment."
  ]
},

{
  id: 51,
  name: "SV Pressing",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Manufacturing of pressing and stamped components.",
  commonMachinery: [
    "Power Presses (Mechanical & Hydraulic)",
    "Progressive Dies",
    "Coil Feeders",
    "Leveling Machines"
  ]
},

{
  id: 52,
  name: "GUDAGUNTI INFRA TECH PVT LTD (RUN CHAINS)",
  category: "Precision Tools & Industrial Components",
  manufacturingFocus:
    "Manufacture of industrial chains (Run Chains) for infrastructure and heavy equipment.",
  commonMachinery: [
    "Chain Assembly Lines",
    "CNC Lathes",
    "Milling Machines",
    "Presses",
    "Heat Treatment Furnaces for chain components"
  ]
},

{
  id: 53,
  name: "Asha Steel Wire Industries",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Manufacturing of steel wire and wire products.",
  commonMachinery: [
    "Wire Drawing Machines",
    "Annealing Furnaces",
    "Pickling Lines (for cleaning)",
    "Stranding Machines",
    "Galvanizing Equipment"
  ]
},

{
  id: 54,
  name: "SHRI RENUKA FILTRATION SYSTEMS",
  category: "Flow Control, Process & Water Systems",
  manufacturingFocus:
    "Manufacturing of filtration systems and components.",
  commonMachinery: [
    "Sheet Metal Fabrication Equipment (Shear, Punch, Brake)",
    "Welding Equipment",
    "CNC Machining Centers (for filter housings)",
    "Filtration Media Testing Rigs"
  ]
},

{
  id: 55,
  name: "REGENT FLOECHEM EQUIPMENTS PVT. LTD",
  category: "Flow Control, Process & Water Systems",
  manufacturingFocus:
    "Manufacturing of fluid handling and chemical equipment (pumps, valves, etc.).",
  commonMachinery: [
    "CNC Machining Centers",
    "CNC Turning Centers",
    "Pump Test Rigs",
    "Welding and Fabrication Equipment"
  ]
},

{
  id: 56,
  name: "PUROGEN INDUSTRIES",
  category: "Flow Control, Process & Water Systems",
  manufacturingFocus:
    "Likely manufacturing of water purification or treatment systems.",
  commonMachinery: [
    "Fabrication Equipment (Shear, Brake)",
    "Welding Equipment",
    "Pipe Cutting & Threading Machines",
    "Assembly & Testing Lines"
  ]
},

{
  id: 57,
  name: "HARA ENGINEERING",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "General engineering and manufacturing services.",
  commonMachinery: [
    "Lathes",
    "Milling Machines",
    "Drilling Machines",
    "Grinders"
  ]
},

{
  id: 58,
  name: "VIRAJ GLOBAL MACHINERY",
  category: "Industrial Automation, Machinery & Training",
  manufacturingFocus:
    "Manufacturing of industrial machinery and equipment.",
  commonMachinery: [
    "Large CNC Machining Centers",
    "Lathes",
    "Milling Machines",
    "Boring Mills",
    "Fabrication Equipment"
  ]
},

{
  id: 59,
  name: "HPK INDUSTRIES",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "General manufacturing of industrial components.",
  commonMachinery: [
    "Lathes",
    "Mills",
    "Drills"
  ]
},

{
  id: 60,
  name: "S.S.P. ENGINEERING",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Engineering works.",
  commonMachinery: [
    "General engineering workshop equipment."
  ]
},
{
  id: 61,
  name: "E-TECHNOFOUR ENGINEERING",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Likely focused on technology-driven engineering solutions.",
  commonMachinery: [
    "CNC Machining",
    "Automation Equipment"
  ]
},

{
  id: 62,
  name: "VISHAL ENGINEERING WORKS",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Engineering works.",
  commonMachinery: [
    "Lathes",
    "Milling Machines",
    "Drilling Machines",
    "Welding Machines"
  ]
},

{
  id: 63,
  name: "V.K. Industries",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "General manufacturing.",
  commonMachinery: [
    "Standard Workshop Equipment"
  ]
},

{
  id: 64,
  name: "Lakshmi Enterprises",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "A common name for a trading or manufacturing firm.",
  commonMachinery: [
    "General Workshop Equipment"
  ]
},

{
  id: 65,
  name: "Shri Siddharoodha Engineering Works",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Engineering works.",
  commonMachinery: [
    "Lathes",
    "Milling Machines",
    "Drilling Machines",
    "Grinding Machines",
    "Welding Equipment"
  ]
},

{
  id: 66,
  name: "Shri Renuka Engineering Works",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Engineering works.",
  commonMachinery: [
    "General Engineering Equipment"
  ]
},

{
  id: 67,
  name: "Ali Raza Engineering Works",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Engineering works.",
  commonMachinery: [
    "Standard Workshop Equipment"
  ]
},

{
  id: 68,
  name: "Sunil Engineering",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Engineering works.",
  commonMachinery: [
    "Lathes",
    "Drilling Machines"
  ]
},

{
  id: 69,
  name: "Ind-Tech Engineering",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Technology-driven engineering services.",
  commonMachinery: [
    "Precision Machining",
    "CNC Equipment"
  ]
},

{
  id: 70,
  name: "Dani Automation",
  category: "Industrial Automation, Machinery & Training",
  manufacturingFocus:
    "Manufacturing of automation solutions and control systems.",
  commonMachinery: [
    "Panel Building Equipment",
    "Soldering/Assembly Tools",
    "Testing/Calibration Instruments"
  ]
},

{
  id: 71,
  name: "Veeresh Fabricators",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Metal fabrication of structures and parts.",
  commonMachinery: [
    "Shearing Machines",
    "Press Brakes",
    "Plate Bending Rolls",
    "CNC Punching/Laser Machines",
    "MIG/TIG/ARC Welding Equipment"
  ]
},

{
  id: 72,
  name: "MAG Tools",
  category: "Precision Tools & Industrial Components",
  manufacturingFocus:
    "Manufacturing of industrial tools, possibly cutting tools or machine tool accessories.",
  commonMachinery: [
    "CNC Grinding Machines",
    "Tool & Cutter Grinders",
    "Milling Machines",
    "Heat Treatment Equipment"
  ]
},

{
  id: 73,
  name: "GURUDEV INDUSTRY",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "General industrial manufacturing.",
  commonMachinery: [
    "General Workshop Equipment"
  ]
},

{
  id: 74,
  name: "AMRUT FOUNDRIES",
  category: "Foundry & Metal Casting",
  manufacturingFocus:
    "Metal casting and foundry work.",
  commonMachinery: [
    "Cupola/Induction Furnaces",
    "Molding Machines",
    "Sand Plant Equipment",
    "Shot Blasting Machines"
  ]
},

{
  id: 75,
  name: "N.A. Pawar Welding Works",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Specialized welding services and fabrication.",
  commonMachinery: [
    "Arc Welding Machines",
    "MIG/TIG Welders",
    "Submerged Arc Welding Machines",
    "Cutting Equipment"
  ]
},

{
  id: 76,
  name: "KHODE TOOLS & DIES",
  category: "Precision Tools & Industrial Components",
  manufacturingFocus:
    "Tool, die, and mould making.",
  commonMachinery: [
    "CNC Milling",
    "CNC EDM (Wire & Sinker)",
    "Precision Surface and Cylindrical Grinders",
    "CMM for inspection"
  ]
},

{
  id: 77,
  name: "PADMASHREE ENGINEERING WORKS",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Engineering works.",
  commonMachinery: [
    "Standard Machine Shop Equipment"
  ]
},

{
  id: 78,
  name: "HELIX INDUSTRIES",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "Likely manufacturing components, possibly for the engineering sector.",
  commonMachinery: [
    "Standard Workshop Equipment",
    "Fabrication Equipment"
  ]
},

{
  id: 79,
  name: "A.R ENTERPRISES",
  category: "Engineering & Metal Fabrication",
  manufacturingFocus:
    "General trading or manufacturing.",
  commonMachinery: [
    "General Engineering Equipment"
  ]
},

{
  id: 80,
  name: "NETTUR TECHNICAL TRAINING FOUDATION (NTTF) Belur Industrial Area",
  category: "Industrial Automation, Machinery & Training",
  manufacturingFocus:
    "NTTF is a premier technical training institution, not a manufacturer. It provides vocational education in tool engineering, mechatronics, and manufacturing.",
  commonMachinery: [
    "CNC Machines",
    "EDM Wire-Cut",
    "Conventional Lathes",
    "3D Printers"
  ]
},
]