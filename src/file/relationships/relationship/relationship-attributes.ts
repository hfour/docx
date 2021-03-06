import { XmlAttributeComponent } from "file/xml-components";

export interface IRelationshipAttributesProperties {
    id: string;
    type: string;
    target: string;
}

export class RelationshipAttributes extends XmlAttributeComponent<IRelationshipAttributesProperties> {
    protected xmlKeys = {
        id: "Id",
        type: "Type",
        target: "Target",
    };
}
