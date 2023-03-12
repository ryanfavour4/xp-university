const db = require("./facultyDB");

class Faculty {
  getAllFaculties = async (req, res) => {
    try {
      const retVal = await db.getAllFaculties();
      if (retVal == null) {
        return res.status(500).json({ Error: db.getError() ? "DB Response was Null" : db.getError() });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  getFaculty = async (req, res) => {
    try {
      const { facultyId } = req.params;
      console.log(facultyId);
      const retVal = await db.getFaculty(facultyId);
      if (retVal == null) {
        res.status(400).json({ Error: "No faculty found" });
      } else {
        res.status(200).send(retVal);
      }
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  getFaculties = async (req, res) => {
    try {
      const { Status, Name } = req.body;
      if (!Status && !Name) {
        return res.status(400).json({ Error: "Please input a valid query" });
      } else {
        const retVal = await db.getFaculties(Status, Name);
        if (retVal == null) {
          res
            .status(400)
            .json({
              Error: db.getError() === null ? "No faculty found" : db.getError(),
            });
        } else {
          res.status(200).send(retVal);
        }
      }
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  addFaculty = async (req, res) => {
    try {
      const faculty = { ...req.body };
      if (!faculty) return res.status(400).json({ Error: "Input Faculty Data" });

      if (this.validate(faculty) !== null) {
        return res.status(400).json({ Error: this.validate(faculty) });
      }
      
      
      const retValue = await db.addFaculty(faculty);
      if (retValue == null) { return res.status(400).json({ Error: db.getError() ? db.getError() : "Db returned null" }); }

      return res.status(200).json({ IsSuccess: true, body: retValue });
    
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  editFaculty = async (req, res) => {
    try {
      const faculty = { ...req.body };

      if (faculty.FacultyId < 1) {
        return res.status(400).json({ Error: "Please input a valid faculty Id" });
      }
      const validate = this.validate(faculty);
      if (validate !== null) {
        return res.status(400).json({ Error: validate });
      }
      else {
        await db.editFaculty(faculty);
        res.status(200).json({ IsSuccessFul: true });
      }
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }
  removeFaculty = async (req, res) => {
    try {
      const { facultyId } = req.params;
      if (facultyId == 0) {
        res.status(400).json({ Error: "Please input a valid faculty Id" });
      } else {
        console.log(facultyId);
        await db.removeFaculty(facultyId);
        res.status(200).json({ IsSuccessFul: true });
      }
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }


  /**
   * 
   * @param {{
   * FacultyId: number,
   * Name: string,
   * UniqueId: string,
   * Code: string,
   * Status: number
   * }} faculty 
   * @returns 
   */
  validate = (faculty) => {
    if (!faculty) return "Input Faculty Data";
    if (!faculty.Name || faculty.Name === "" || faculty.Name.length < 3) {
      return "Invalid/Empty faculty name";
    }
    if (!faculty.UniqueId || faculty.UniqueId === "") {
      return "Invalid/Missing UniqueId";
    }
    if (!faculty.Code || faculty.Code === "") {
      return "Invalid/Missing code";
    }
    if (!faculty.Status || faculty.Status === 0) {
      return "Invalid/Missing status";
    }
    return null;
  }
}

module.exports = new Faculty;
