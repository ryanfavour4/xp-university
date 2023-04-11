const db = require("./departmentDB");

class Course {
  async getAllDepartments(req, res) {
    try {
      const retVal = await db.getAllDepartments();
      if (retVal == null) {
        res.status(400).json({ Error: db.getError() === null ? "DB Response Was Null" : db.getError() });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }


  async getDepartments(req, res) {
    try {
      const { FacultyId, Status, Name } = req.body;
      const retVal = await db.getDepartments(FacultyId, Status, Name);
      if (retVal == null) {
        res.status(400).json({ Error: db.getError() === null ? "DB Response Was Null" : db.getError() });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  async getDepartment(req, res) {
    try {
      const deptId = req.params.id;
      const retVal = await db.getDepartment(deptId);
      if (retVal == null) {
        return res.status(400).json({
          Error:
            db.getError() === null ? "DB Response Was Null" : db.getError(),
        });
      }
      res.status(200).send(retVal);
    } catch (error) {
      return res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  async addDepartment(req, res) {
    try {
      const {
        Name,
        FacultyId,
        UniqueId,
        Code,
        Status,
      } = req.body;
      //Validate Api here
      if (!Name || Name.length < 3) {
        return res.status(400).json({ Error: "Invalid/Empty Department Name" });
      }
      if (!FacultyId || FacultyId < 1) {
        return res.status(400).json({ Error: "Invalid Faculty Id" });
      }
      if (!UniqueId || UniqueId.length < 3) {
        return res.status(400).json({ Error: "Invalid Unique Id" });
      }
      if (!Code || Code.length < 2) {
        return res.status(400).json({ Error: "Invalid Code" });
      }
      if (Status < 0) {
        return res.status(400).json({ Error: "Invalid Status" });
      }
      const retvalue = await db.addDepartment({Name, FacultyId, UniqueId, Code, Status});
      if (retvalue == null) {
        return res.status(400).json({ Error: db.getError() || "DB Response Was Null" });
      }

      res.status(200).json({ IsSuccessFul: true, body: retvalue });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ Error: error });
    }
  }

  async removeDepartment(req, res) {
    try {
      if (!(req.params.id)) {
        res.status(400).json({ Error: "Please input a valid course Id" });
      }
      await db.removeDepartment(req.params.id)
      res.status(200).json({ IsSuccessFul: true });
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  async editDepartment(req, res) {
    try {
      const department = { ...req.body };
      if (department.Name === "" || department.Name.length < 3) {
        res.status(400).json({ Error: "Invalid/Empty Department Name" })
      }
      await db.editDepartment(department);
      res.status(200).json({ IsSuccessFul: true });
    } catch (error) {
      res.status(400).json({ Error: error })
      console.log(error);
    }
  }
}

module.exports = new Course();
