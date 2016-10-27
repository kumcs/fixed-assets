SELECT dropIfExists('trigger', 'assettrigger', 'asset');

CREATE OR REPLACE FUNCTION asset._assettrigger()
  RETURNS trigger AS $$
-- Copyright (c) 2016 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _commentText TEXT;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    PERFORM postComment('ChangeLog', 'FADOC', NEW.id, 'Created');
  END IF;
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.asset_type<>NEW.asset_type) THEN
      _commentText := (SELECT assettype_code FROM asset.asset_type WHERE id = NEW.asset_type);
      PERFORM postComment('ChangeLog', 'FADOC', NEW.id, format('Asset Type changed to %s', _commentText));
    END IF;
    IF (OLD.asset_status<>NEW.asset_status) THEN
      _commentText := (SELECT assetstatus_code FROM asset.asset_status WHERE assetstatus_id = NEW.asset_status);
      PERFORM postComment('ChangeLog', 'FADOC', NEW.id, format('Asset Status changed to %s', _commentText));
    END IF;
    IF (OLD.asset_purch_price<>NEW.asset_purch_price) THEN
      PERFORM postComment('ChangeLog', 'FADOC', NEW.id, format('Asset purchase price changed to %s', NEW.asset_purch_price::TEXT));
    END IF;  
    IF (OLD.asset_location_id<>NEW.asset_location_id OR OLD.asset_crmacct_id<>NEW.asset_crmacct_id) THEN
      IF (NEW.asset_location_id IS NOT NULL) THEN
        _commentText := formatLocationName(NEW.asset_location_id);
        PERFORM postComment('ChangeLog', 'FADOC', NEW.id, format('Asset moved to location %s', _commentText));
      ELSIF (NEW.asset_crmacct_id IS NOT NULL) THEN
        _commentText := (SELECT crmacct_number FROM crmacct WHERE crmacct_id=NEW.asset_crmacct_id);
        PERFORM postComment('ChangeLog', 'FADOC', NEW.id, format('Asset moved to Account %s', _commentText));
      END IF;
    END IF;
  END IF;  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER assettrigger
  AFTER INSERT OR UPDATE
  ON asset.asset
  FOR EACH ROW
  EXECUTE PROCEDURE asset._assettrigger();

