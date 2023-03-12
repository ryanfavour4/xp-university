const db = require('./courseOfStudyDB')

class CourseOfStudy {

    async getAllCoursesOfStudy(req, res) {
        try {
            const retVal = await db.getAllCoursesOfStudy();
            if (retVal == null) {
                res.status(400).json({ Error: "DB Response Was Null" });
            }
            res.status(200).send(retVal);
        } catch (error) {
            res.status(400).json({ Error: error });
            console.log(error);
        }
    }

    async getCoursesOfStudy(req, res) {
        try {
            const { deptId, status, name } = req.body;
            const retVal = await db.getCoursesOfStudy(deptId, status, name);
            if (retVal == null) {
                res.status(400).json({ Error: db.getError() === null ? "DB Response Was Null" : db.getError() });
            }
            res.status(200).send(retVal);
        } catch (error) {
            res.status(400).json({ Error: error });
            console.log(error);
        }
    }

    async getCourseOfStudy(req, res) {
        try {
            const courseOfStudy = await db.getCourseOfStudy(req.params.id)
            res.json(courseOfStudy)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async createCourseOfStudy(req, res) {
        try {
            const validatedCourseOfStudy = validate(req.body)
            if (validatedCourseOfStudy !== "") {
                return res.status(400).json({ message: validatedCourseOfStudy })
            }
            console.log(req.body)
            const retval = await db.addCourseOfStudy(req.body)
            if (retval === null) {
                return res.status(400).json({ message: db.getError() || "DB Response Was Null" })
            }
            res.status(201).json({ message: "Course Of Study Created Successfully", body: retval})
        }
        catch (error) {
            res.status(500).json({ message: error.message })
        }

    }

    async updateCourseOfStudy(req, res) {
        try {
            const input = req.body;
            if (input.CourseOfStudyId == null || input.CourseOfStudyId == undefined || input.CourseOfStudyId < 1) {
                return res.status(400).json({ message: "Course Of Study Id is required" })
            }
            const validatedCourseOfStudy = validate(input)
            if (validatedCourseOfStudy !== "") {
                return res.status(400).json({ message: validatedCourseOfStudy })
            }
            const updatedCourseOfStudy = await db.editCourseOfStudy(input)
            res.json({ message: "Course Of Study Updated Successfully", body: updatedCourseOfStudy})
        }
        catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async deleteCourseOfStudy(req, res) {
        try {
            const deletedCourseOfStudy = await db.removeCourseOfStudy(req.params.id)
            res.json(deletedCourseOfStudy)
        }
        catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

}

/**
 * 
 * @param {{
 * DepartmentId: number,
 * Name: string,
 * ShortName: string,
 * UniqueId: string,
 * Award: string,
 * Duration: number,
 * RequiredCreditUnits: number,
 * Advisor: string,
 * Status: number
 * }} CoursefStudy 
 */
const validate = (CourseOfStudy) => {
    if (CourseOfStudy.DepartmentId == null || CourseOfStudy.DepartmentId == undefined || CourseOfStudy.DepartmentId < 1) {
        return "DepartmentId is required. ";
    }
    if (CourseOfStudy.Name == null || CourseOfStudy.Name == undefined || CourseOfStudy.Name.length < 1) {
        return "Name is required. ";
    }
    if (CourseOfStudy.ShortName == null || CourseOfStudy.ShortName == undefined || CourseOfStudy.ShortName.length < 1) {
        return "ShortName is required. ";
    }
    if (CourseOfStudy.UniqueId == null || CourseOfStudy.UniqueId == undefined || CourseOfStudy.UniqueId.length < 1) {
        return "UniqueId is required. ";
    }
    if (CourseOfStudy.Award == null || CourseOfStudy.Award == undefined || CourseOfStudy.Award.length < 1) {
        return "Award is required. ";
    }
    if (CourseOfStudy.Duration == null || CourseOfStudy.Duration == undefined || CourseOfStudy.Duration < 1) {
        return "Duration is required. ";
    }
    if (CourseOfStudy.RequiredCreditUnits == null || CourseOfStudy.RequiredCreditUnits == undefined || CourseOfStudy.RequiredCreditUnits < 1) {
        return "RequiredCreditUnits is required. ";
    }
    if (CourseOfStudy.Advisor == null || CourseOfStudy.Advisor == undefined || CourseOfStudy.Advisor.length < 1) {
        return "Advisor is required. ";
    }
    if (CourseOfStudy.Status == null || CourseOfStudy.Status == undefined || CourseOfStudy.Status < 1) {
        return "Status is required. ";
    }
    return "";
}



module.exports = new CourseOfStudy()