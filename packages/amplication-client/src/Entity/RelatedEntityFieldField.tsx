import { gql, useQuery } from "@apollo/client";
import { useFormikContext } from "formik";
import React from "react";
import * as models from "../models";
import { EntityRelationFieldsChart } from "./EntityRelationFieldsChart";
import "./RelatedEntityFieldField.scss";
import { useRouteMatch } from "react-router-dom";

const CLASS_NAME = "related-entity-field-field";

type Props = {
  entityDisplayName: string;
};

const RelatedEntityFieldField = ({ entityDisplayName }: Props) => {
  const match = useRouteMatch<{
    application: string;
    entity: string;
    field: string;
  }>("/:application/entities/:entity/fields/:field");
  const formik = useFormikContext<models.EntityField>();
  const { data } = useQuery<{ entity: models.Entity }>(
    GET_ENTITY_FIELD_BY_PERMANENT_ID,
    {
      variables: {
        entityId: formik.values.properties.relatedEntityId,
        fieldPermanentId: formik.values.properties.relatedFieldId,
      },
    }
  );

  const { entity } = match?.params ?? {};

  const relatedField =
    data &&
    data.entity &&
    data.entity.fields &&
    data.entity.fields.length &&
    data.entity.fields[0];

  return (
    <div className={CLASS_NAME}>
      {data && relatedField && (
        <EntityRelationFieldsChart
          fixInPlace={false}
          applicationId={data.entity.appId}
          entityId={entity}
          field={formik.values}
          entityName={entityDisplayName}
          relatedField={relatedField}
          relatedEntityName={data.entity.displayName}
          onSubmit={() => {}}
        />
      )}
    </div>
  );
};

export default RelatedEntityFieldField;

export const GET_ENTITY_FIELD_BY_PERMANENT_ID = gql`
  query GetEntityFieldByPermanentId(
    $entityId: String!
    $fieldPermanentId: String
  ) {
    entity(where: { id: $entityId }) {
      id
      displayName
      appId
      fields(where: { permanentId: { equals: $fieldPermanentId } }) {
        id
        permanentId
        displayName
        name
        properties
      }
    }
  }
`;
