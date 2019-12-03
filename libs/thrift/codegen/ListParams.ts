/* tslint:disable */
/* eslint-disable */
/*
 * Autogenerated by @creditkarma/thrift-typescript v3.8.2
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
*/
import * as thrift from "thrift";
export interface IListParamsArgs {
    pm_id?: number;
}
export class ListParams {
    public pm_id?: number;
    constructor(args?: IListParamsArgs) {
        if (args != null && args.pm_id != null) {
            this.pm_id = args.pm_id;
        }
    }
    public write(output: thrift.TProtocol): void {
        output.writeStructBegin("ListParams");
        if (this.pm_id != null) {
            output.writeFieldBegin("pm_id", thrift.Thrift.Type.I32, 1);
            output.writeI32(this.pm_id);
            output.writeFieldEnd();
        }
        output.writeFieldStop();
        output.writeStructEnd();
        return;
    }
    public static read(input: thrift.TProtocol): ListParams {
        input.readStructBegin();
        let _args: any = {};
        while (true) {
            const ret: thrift.TField = input.readFieldBegin();
            const fieldType: thrift.Thrift.Type = ret.ftype;
            const fieldId: number = ret.fid;
            if (fieldType === thrift.Thrift.Type.STOP) {
                break;
            }
            switch (fieldId) {
                case 1:
                    if (fieldType === thrift.Thrift.Type.I32) {
                        const value_1: number = input.readI32();
                        _args.pm_id = value_1;
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                default: {
                    input.skip(fieldType);
                }
            }
            input.readFieldEnd();
        }
        input.readStructEnd();
        return new ListParams(_args);
    }
}