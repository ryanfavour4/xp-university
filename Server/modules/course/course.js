const db = require("./courseDB");
const { Validator } = require('../../validator')
const validation = new Validator()

class Course {
  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @returns jnoih
   */
  async getAllCourses(req, res) {
    try {
      const retVal = await db.getAllCourses();
      if (retVal == null) {
        return res.status(400).json({ Error: db.getError() ? "DB Response was Null" : db.getError() });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  async getCourses(req, res) {
    try {
      if (req.body == null) {
        return res.status(400).json({ Error: "Invalid request parameters" });
      }
      const { DepartmentId, Status, Name } = req.body;
      const retVal = await db.getCourses(DepartmentId, Status, Name);
      if (retVal == null) {
        return res.status(400).json({ Error: db.getError() == null ? "DB Response Was Null" : db.getError() });
      }
      if (retVal.length < 1) {
        return res.status(404).json({ Error: "No Courses Found" });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
    }
  }

  async getCourse(req, res) {
    try {
      // if (!req.params) {
      //   return res.status(400).json({ Error: "Please input a valid course Id" });
      // }
      const courseId = req.params.id;
      const retVal = await db.getCourse(courseId);
      if (retVal == null) {
        return res.status(400).json({
          Error: db.getError() === null ? "DB Response Was Null" : db.getError() });
      }
      if (retVal.length < 1) {
        return res.status(404).json({ Error: "Course Not Found" });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  async addCourse(req, res) {
    try {
      if (req.body == null) {
        return res.status(400).json({ Error: "Invalid request parameters" });
      }
      const course = { ...req.body };
      //Validate Api here
      const validateRes = validator(course);
      if (validateRes.length > 1) {
        res.status(400).json({ Error: validate });
      }
      if (!await db.addCourse(course)) {
        return res.status(400).json({ Error: db.getError() })
      }
      res.status(200).json({ IsSuccessFul: true })
    } catch (error) {
      console.log(error);
      return res.status(400).json({ Error: error });
    }
  }

  async editCourse(req, res) {
    try {
      if (req.body == null) {
        return res.status(400).json({ Error: "Invalid request parameters" });
      }
      const course = { ...req.body };
      if (course.CourseId < 1) {
        return res.status(400).json({ Error: "Course Id is required" });
      }
      const validate = validator(course);
      if (validate.length > 1) {
        return res.status(400).json({ Error: validate });
      }
      if (!await db.editCourse(course)) {
        return res.status(400).json({ Error: db.getError() })
      }
      res.status(200).json({ IsSuccessFul: true });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ Error: error })
    }
  }

  async removeCourse(req, res) {
    try {
      if (!(req.params.id)) {
        res.status(400).json({ Error: "Please input a valid course Id" });
      }
      await db.removeCourse(req.params.id)
      res.status(200).json({ IsSuccessFul: true });
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

}

/**
 * Validates the course object passes in to the api
 * @param {{
 * Name: string,
 * DepartmentId: number,
 * UniqueId: string,
 * Code: string,
 * Units: number,
 * CourseLevel: number,
 * CourseSemester: number,
 * Status: number
 * }} course
 * @returns {string} Returns an empty string if the course object is valid else returns an error message
 */
const validator = (course) => {
  if(!validation.minlength(course.Name, 3, "Course Name")) return validation.errorMsg;
  if (course.Name === "" || course.Name.length < 3) {
    return "Invalid/Empty Course Name";
  }
  if (course.DepartmentId < 1) {
    return "Invalid Department Id";
  }
  if (course.UniqueId == "" || course.UniqueId.length < 4) {
    return "Invalid Unique Id";
  }
  if (course.Code == "" || course.Code.length < 2) {
    return "Invalid Course Code";
  }
  if (course.Units < 1) {
    return "Invalid Course Units";
  }
  if (course.CourseLevel < 1) {
    return "Invalid Course Level";
  }
  if (course.CourseSemester == 0) {
    return "Invalid Course Semester";
  }
  if (course.Status == 0) {
    return "Invalid Status";
  }
  return "";
}

const checkBody = (body) => {
  if (body == null) {
    return false;
  }
  true
}

module.exports = new Course;