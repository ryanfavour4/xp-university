const db = require("./lecturerDB");

class Lecturer{
    async getAllLecturers(req, res){
        try{
            const retVal = await db.getAllLecturers();
            if(retVal == null){
                res.status(400).json({Error: "DB Response Was Null" });
            }
            res.status(200).send(retVal);
        } catch(error){
            res.status(400).json({ Error: error });
            console.log(error);
        }
    }

    async getLecturers(req, res){
        try{
            const { DepartmentId, Status, Name } = req.body;
            const retVal = await db.getLecturers(DepartmentId, Status, Name);
            
            if(retVal == null){
                res.status(400).json({
                    Error: db.getError() === null ? "DB Response was Null" : db.getError() 
                });
            }
            res.status(200).send(retVal);
        } catch(error){
            res.status(400).json({Error: error});
            console.log(error);
        }
    }

    async addLecturer(req, res){
        try{
            const lecturer = { ... req.body };
            //Validate Api here
            const validate = validator(lecturer);
            if(validate.length > 1){
                res.status(400).json({ Error: validate});
            }
            if(!await db.addLecturer(lecturer)){
                return res.status(400).json({ Error: db.getError() })
            } 
            res.status(200).json({ IsSuccessFul: true})
        } catch(error){
            res.status(400).json({ Error: error});
            console.log(error);
        }
    }
    //GET EACH LECTURER
    
    async getLecturer(req, res){
        try{
            const  lecturerId =  req.params.id;
            const retVal = await db.getLecturer(lecturerId);
            if(retVal == null){
                return res.status(400).json({Error: "DB Response Was Null"});
            }
            res.status(200).send(retVal);
        } catch(error){
            res.status(400).json({Error: error});
            console.log(error);
        }
    }


    async removeLecturer(req, res){ 
        try{
            // Fix this delete courses
            const  lecturerId =  req.params.id;
            const retVal = await db.removeLecturer(lecturerId);
            if(retVal === null){
                return res.status(400).json({ Error: "DB Response Was Null" });           
            }
            res.status(200).send(retVal);
        } catch(error){
            res.status(400).json({ Error: error });
            console.log(error);
        }
    }


    async editLecturer(req, res){
        try{
            const lecturer = { ... req.body };
            if(lecturer && lecturer.LecturerId < 1){
                return res.status(400).json({ Error: "Lecturer Id is required"});
            }
            const validate = validator(lecturer);
            if(validate.length > 1){
                return res.status(400).json({ Error: validate});
            }
            if(!await db.editLecturer(lecturer)){
                return res.status(400).json({ Error: db.getError() })
            }      
            res.status(200).json({ IsSuccessFul: true});
        } catch(error){
            res.status(400).json({ Error: error})
            console.log(error);
        }
    }

    }

/**
 * 
 * @param {{
    *  FirstName: string,
    * Surname: string,
    * OtherNames: string,
    * StaffId: string,
    * DepartmentId: number,
    * Status: number
 * }} lecturer 
 * @returns 
 */
const validator = (lecturer) => {
    if(!lecturer.FirstName || lecturer.FirstName.length < 3){
        return "Invalid/Empty Lecturer FirstName";
    }
    if(!lecturer.DepartmentId || lecturer.DepartmentId < 1){
        return "Invalid Department Id";
    }
    if(!lecturer.StaffId || lecturer.StaffId.length < 4){
        return "Invalid Unique Id";
    }
    if(!lecturer.Surname || lecturer.Surname.length < 3){
        return "Invalid/Empty Lecturer Surname";
    }
    if(lecturer.OtherNames && (typeof lecturer?.OtherNames !== "string" || lecturer.OtherNames.length < 3)){
        return "Invalid/Empty Lecturer Other Names";
    }
    if(!lecturer.Status  || lecturer.Status < 0){
        return "Invalid Status";
    }
    return "";
}

module.exports = new Lecturer;